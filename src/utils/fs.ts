import * as fs from 'fs/promises';
import * as p from 'path';

export const exists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

export async function* getFiles(path = './'): AsyncGenerator<string> {
  const entries = await fs.readdir(path, { withFileTypes: true });

  for (const file of entries) {
    if (file.isDirectory()) {
      yield* getFiles(p.join(path, file.name));
    } else {
      yield p.join(path, file.name);
    }
  }
}
