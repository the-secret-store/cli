import fs from 'fs';
import path from 'path';
import readline from 'readline';

interface ENVObjectType {
  [key: string]: string | number;
}

export async function exposeEnvAsObject(rootDir: string): Promise<ENVObjectType> {
  let data: ENVObjectType = {};

  const filePath = path.resolve(rootDir, '.env');

  if (!fs.existsSync(filePath)) {
    console.log('ENV does not exist locally.');
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

export function exportEnvFromObject(envAsObject: ENVObjectType, rootDir: string) {
  const envFilePath = path.resolve(rootDir, '.env');
  const envFile = fs.createWriteStream(envFilePath);
  const content = Object.entries(envAsObject)
    .map(([key, value]) => `${key} = ${value}`)
    .join('\n');
  envFile.write(content);
  envFile.close();
}
