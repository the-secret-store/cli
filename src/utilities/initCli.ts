import fs from 'fs';
import os from 'os';
import path from 'path';

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

export function initCli() {
  if (!fs.existsSync(CONFIGURATION_FILE)) {
    fs.writeFileSync(CONFIGURATION_FILE, '{}');
  }
}
