import { FileNotFoundError } from '../errors';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface ENVObjectType {
  [key: string]: string | number;
}

export async function exposeEnvAsObject(
  rootDir: string,
  fileName = '.env'
): Promise<ENVObjectType> {
  const data: ENVObjectType = {};

  const filePath = path.resolve(rootDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new FileNotFoundError(filePath);
  }

  const fileStream = fs.createReadStream(filePath);

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    if (line.trim() === '') continue;

    const keyValuePair = line.split('=');
    data[keyValuePair[0].trim()] = keyValuePair[1].trim();
  }

  fileStream.close();
  return data;
}

export function exportEnvFromObject(
  envAsObject: ENVObjectType,
  rootDir: string,
  fileName = '.env'
) {
  const envFilePath = path.resolve(rootDir, fileName);
  const envFile = fs.createWriteStream(envFilePath);
  const content = Object.entries(envAsObject)
    .map(([key, value]) => `${key} = ${value}`)
    .join('\n');
  envFile.write(content);
  envFile.close();
}
