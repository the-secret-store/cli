import fs from 'fs';
import os from 'os';
import path from 'path';
import { ConfigurationError } from '../errors';

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

export function getAuthToken() {
  try {
    const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
    const config = JSON.parse(tssrc);

    return config.authToken;
  } catch (error) {
    throw new ConfigurationError(error);
  }
}
