import fs from 'fs';
import os from 'os';
import path from 'path';
import { ConfigurationError } from '../errors';
import prettyJson from '../utilities/prettyJson';

export interface Configurations {
  authToken?: string;
  refreshToken?: string;
  specialAccessToken?: string;
  noOfLocalBackups: number;
  preferredEditor: string;
  hashSecrets: boolean;
}

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

export class ConfigService {
  static addConfigurations(configuration: { [key: string]: any }) {
    try {
      const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
      const config = { ...JSON.parse(tssrc), ...configuration };
      fs.writeFileSync(CONFIGURATION_FILE, prettyJson(config));
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }

  static getConfigurations(): Configurations {
    try {
      const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
      return JSON.parse(tssrc);
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }

  static getConfiguration(key: string) {
    try {
      const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
      const config = JSON.parse(tssrc);
      return config[key];
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }

  static removeConfigurations(...keys: string[]) {
    try {
      const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
      const config = JSON.parse(tssrc);
      const updatedEntries = Object.entries(config).filter(
        ([key]) => !keys.includes(key)
      );

      const newConfig = Object.fromEntries(updatedEntries);
      fs.writeFileSync(CONFIGURATION_FILE, prettyJson(newConfig));
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }
}
