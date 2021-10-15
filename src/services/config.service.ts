import fs from 'fs';
import os from 'os';
import path from 'path';
import { ConfigurationError } from '../errors';

export function addConfiguration(configuration: { [key: string]: any }) {
  const rc = path.resolve(os.homedir(), '.tssrc');
  try {
    const tssrc = fs.readFileSync(rc, 'utf8');
    const config = { ...JSON.parse(tssrc), ...configuration };
    fs.writeFileSync(rc, JSON.stringify(config, null, 2));
  } catch (exp) {
    throw new ConfigurationError(exp);
  }
}
