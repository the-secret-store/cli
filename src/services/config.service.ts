import fs from 'fs/promises';
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
  static async addConfigurations(configuration: { [key: string]: any }) {
    try {
      const tssrc = await fs.readFile(CONFIGURATION_FILE, 'utf8');
      const config = { ...JSON.parse(tssrc), ...configuration };
      await fs.writeFile(CONFIGURATION_FILE, prettyJson(config));
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }

  static async getConfigurations(): Promise<Configurations> {
    try {
      const tssrc = await fs.readFile(CONFIGURATION_FILE, 'utf8');
      return JSON.parse(tssrc);
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }

  static async getConfiguration(key: keyof Configurations) {
    try {
      const tssrc = await fs.readFile(CONFIGURATION_FILE, 'utf8');
      const config = JSON.parse(tssrc);
      return config[key];
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }

  static async removeConfigurations(...keys: string[]) {
    try {
      const tssrc = await fs.readFile(CONFIGURATION_FILE, 'utf8');
      const config = JSON.parse(tssrc);
      const updatedEntries = Object.entries(config).filter(
        ([key]) => !keys.includes(key)
      );

      const newConfig = Object.fromEntries(updatedEntries);
      await fs.writeFile(CONFIGURATION_FILE, prettyJson(newConfig));
    } catch (exp) {
      throw new ConfigurationError(exp as Error);
    }
  }
}
