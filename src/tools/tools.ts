import * as fs from 'fs/promises';
import { google, sheets_v4 } from 'googleapis';
import * as p from 'path';
import { exists, getFiles } from '../utils/fs';
import { config } from '../config';

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
  for await (const file of getFiles('./src')) {
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
          mod[modName][`k${m.groups.key}`] = m.groups.defaultValue;
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

const mergeResources = async (newRes: any, existingRes: any): Promise<any> => {
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

export const readGoogleSheetData = async (): Promise<[sheets_v4.Sheets, string[][] | undefined]> => {
  const { google: googleSettings } = await config();
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const privatekey = JSON.parse(await fs.readFile(googleSettings.privateKey, 'utf-8'));
  const auth = new google.auth.JWT(privatekey.client_email, undefined, privatekey.private_key, SCOPES);

  await auth.authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const sheet = await sheets.spreadsheets.values.get({
    spreadsheetId: googleSettings.spreadsheetId,
    range: 'A:Z',
  });
  const { values } = sheet.data;
  return [sheets, values];
};

const writeGoogleSheetData = async (sheets: sheets_v4.Sheets, data: string[][]) => {
  const { google: googleSettings } = await config();
  await sheets.spreadsheets.values.update({
    spreadsheetId: googleSettings.spreadsheetId,
    range: 'A:Z',
    valueInputOption: 'RAW',
    requestBody: { values: data },
  });
};

export const sheetDataToResource = (values?: string[][]): object => {
  const dist = {} as any;
  if (!values) {
    return dist;
  }
  const [,,...langs] = values[0];
  for (let i = 1; i < values.length; ++i) {
    const [ns, key, ...vals] = values[i];
    for (let j = 0; j < vals.length; ++j) {
      const lng = dist[langs[i]] || {} as any;
      const namespace = lng[ns] || {} as any;
      namespace[key] = vals[j];
      lng[ns] = namespace;
      dist[langs[i]] = lng;
    }
  }
  return dist;
};

const resourcesToSheetData = (distHeader: string[], resources: any): string[][] => {
  const res = new Array<Array<string>>();
  const langs = Object.keys(resources);
  const namespaces = Object.keys((resources)[langs[0]]);
  res.push([distHeader[0], distHeader[1], ...langs]);
  for (const ns of namespaces) {
    const keys = Object.keys((resources)[langs[0]][ns]);
    for (const key of keys) {
      res.push([ns, key, ...langs.map((lang) => resources[lang][ns][key])]);
    }
  }
  return res;
};

const uploadGoogleSheet = async () => {
  const [sheets, values] = await readGoogleSheetData();
  const dist = sheetDataToResource(values);
  const source = await scanResources();
  const merged = await mergeResources(source, dist);
  const sheetData = resourcesToSheetData(values![0], merged);
  await writeGoogleSheetData(sheets, sheetData);
  return [sheetData, merged];
};

export const sync = async () => {
  await createTranslations();
  const [, merged] = await uploadGoogleSheet();
  const resources = (await config()).resourcesFile;
  await fs.writeFile(resources, JSON.stringify(merged, null, '  '), 'utf-8');
};
