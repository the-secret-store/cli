import fs from 'fs';
import path from 'path';
import readline from 'readline';

interface ENVObjectType {
  [key: string]: string | number;
}

export async function exposeEnvAsObject(rootDir: string): Promise<ENVObjectType> {
  let data: ENVObjectType = {};

  // todo: handle no file error
  const fileStream = fs.createReadStream(path.resolve(rootDir, '.env'));

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    if (line.trim() === '') continue;

    const keyValuePair = line.split('=');
    data[keyValuePair[0].trim()] = keyValuePair[1].trim();
  }

  return data;
}

export function exportEnvFromObject(envAsObject: ENVObjectType, rootDir: string) {
  const envFilePath = path.resolve(rootDir, '.env');
  const envFile = fs.createWriteStream(envFilePath);
  const content = Object.entries(envAsObject)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  // for (const key in envAsObject) {
  //   if (Object.prototype.hasOwnProperty.call(envAsObject, key)) {
  //     const value = envAsObject[key];
  //     console.log(`${key}=${value}`);
  //   }
  // }
  envFile.write(content);
}

// const envObject = { PORT: '5000', HOST: '127.0.0.1' };

// exposeEnvAsObject().then(val => console.log(val));
// exportEnvFromObject(envObject);
