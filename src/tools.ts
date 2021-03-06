import * as fs from 'fs/promises';
import * as p from 'path';
import { exists, getFiles } from './utils/fs';
import { config } from './config';

const mergeObjects = (src: any, dist: any) => {
  const distKeys = Object.keys(dist);
  const srcKeys = Object.keys(src);

  const missingDistKeys = srcKeys.filter((l) => !distKeys.includes(l));
  const missingSrcKeys = distKeys.filter((l) => !srcKeys.includes(l));

  for (const key of missingSrcKeys) {
    // eslint-disable-next-line no-param-reassign
    delete dist[key];
  }

  for (const key of missingDistKeys) {
    // eslint-disable-next-line no-param-reassign
    dist[key] = src[key];
  }
};

export const scanResources = async () => {
  const mods = new Array<any>();
  for await (const file of getFiles((await config()).source)) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const data = await fs.readFile(file, 'utf-8');
      const match = data.matchAll(/\.k(?<key>[\d]+)\(["'`](?<defaultValue>.*?)["'`]\)/gs);
      const mod = {} as any;
      mods.push(mod);
      const modName = p.parse(file).name;
      for (const m of match) {
        if (m.groups) {
          if (!mod[modName]) {
            mod[modName] = {} as any;
          }
          mod[modName][`k${m.groups.key}`] = m.groups.defaultValue.replace('\\\'', '\'');
        }
      }
    }
  }
  const existedMods = mods.filter((m) => Object.keys(m).length > 0);
  const keys = {} as any;
  for (const e of existedMods) {
    Object.assign(keys, e);
  }
  const res = {} as any;
  for (const lang of (await config())['available-langs']) {
    res[lang] = { ...keys };
  }
  return res;
};

export const syncTranslationWithCode = async (resourceData?: object) => {
  const { resourcesFile, 'available-langs': availableLangs, defaultLang } = (await config());

  if (resourceData) {
    await fs.writeFile(resourcesFile, JSON.stringify(resourceData, null, '  '), 'utf-8');
  }

  if (!await exists(resourcesFile)) {
    console.warn(`No resource file was found: ${resourcesFile}`);
    return;
  }

  const resources = JSON.parse(await fs.readFile(resourcesFile, 'utf-8'));
  const langResources = resources[defaultLang || availableLangs[0]] as { [key: string]: { [key: string]: string } };
  if (!langResources) {
    console.warn(`No translations found for: ${defaultLang || availableLangs[0]}`);
    return;
  }

  for await (const file of getFiles((await config()).source)) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const data = await fs.readFile(file, 'utf-8');
      const match = data.matchAll(/\.k(?<key>[\d]+)\(["'`](?<defaultValue>.*?)["'`]\)/gs);
      const modName = p.parse(file).name;
      const translations = langResources[modName] || [];
      const replacements = Array.from(match)
        .filter(({ groups }) => Boolean(groups))
        .map(({ groups }) => {
          const { key, defaultValue } = groups!;
          return [`.k${key}`, defaultValue, translations[`k${key}`]];
        });

      const updatedCode = replacements.filter(([,,translation]) => Boolean(translation)).reduce((acc, replacement) => {
        const [key, defaultValue, translatedValue] = replacement;

        const regExp = new RegExp(`(${key}\\(\\s?[\`'"]).*?([\`'"]\\s?\\))`, 'g');

        if (defaultValue !== translatedValue) {
          console.log(`[${file}] "${defaultValue}" -> "${translatedValue}"`);
        }

        return acc.replace(regExp, `$1${translatedValue.replace(/'/g, '\\\'')}$2`);
      }, data);
      await fs.writeFile(file, updatedCode, 'utf-8');
    }
  }
};

export const mergeResources = async (newRes: any, existingRes: any): Promise<any> => {
  mergeObjects(newRes, existingRes);
  for (const lang of Object.keys(newRes)) {
    mergeObjects(newRes[lang], existingRes[lang]);
    const newLang = newRes[lang];
    const distLang = existingRes[lang];
    for (const ns of Object.keys(newLang)) {
      mergeObjects(newLang[ns], distLang[ns]);
    }
  }
  return existingRes;
};

export const createTranslations = async () => {
  const res = await scanResources();

  const resources = (await config()).resourcesFile;
  if (!await exists(resources)) {
    await fs.writeFile(resources, JSON.stringify(res, null, '  '), 'utf-8');
  } else {
    const existingRes = JSON.parse(await fs.readFile((await config()).resourcesFile, 'utf-8'));
    const data = JSON.stringify(await mergeResources(res, existingRes), null, '  ');
    await fs.writeFile(resources, data, 'utf-8');
  }
};
