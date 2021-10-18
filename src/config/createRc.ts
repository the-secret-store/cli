import fs from 'fs';
import os from 'os';
import path from 'path';
import { Configurations } from '../services/config.service';

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

const defaultConfigs: Configurations = {
  noOfLocalBackups: 1,
  preferredEditor: 'code',
  hashSecrets: false
};

export function createRc() {
  if (!fs.existsSync(CONFIGURATION_FILE)) {
    console.info('tssrc is not found, creating a new default config.');
    fs.writeFileSync(CONFIGURATION_FILE, JSON.stringify(defaultConfigs));
  }
}
