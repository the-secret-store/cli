import fs from 'fs';
import os from 'os';
import path from 'path';
import pc from 'picocolors';
import { Configurations } from '../services/config.service';
import prettyJson from '../utilities/prettyJson';

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

const defaultConfigs: Configurations = {
  noOfLocalBackups: 1,
  preferredEditor: 'code',
  hashSecrets: false
};

export function createRc() {
  if (!fs.existsSync(CONFIGURATION_FILE)) {
    console.info(pc.cyan('tssrc is not found, creating a new default config.'));
    fs.writeFileSync(CONFIGURATION_FILE, prettyJson(defaultConfigs));
  }
}
