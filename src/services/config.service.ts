import fs from 'fs';
import os from 'os';
import path from 'path';
import { ConfigurationError } from '../errors';

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

export function addConfiguration(configuration: { [key: string]: any }) {
  try {
    const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
    const config = { ...JSON.parse(tssrc), ...configuration };
    fs.writeFileSync(CONFIGURATION_FILE, JSON.stringify(config, null, 2));
  } catch (exp) {
    throw new ConfigurationError(exp);
  }
}

export function getConfigurations() {
  try {
    const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
    return JSON.parse(tssrc);
  } catch (exp) {
    throw new ConfigurationError(exp);
  }
}

export function getConfiguration(key: string) {
  try {
    const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
    const config = JSON.parse(tssrc);
    return config[key];
  } catch (exp) {
    throw new ConfigurationError(exp);
  }
}

export function removeConfiguration(key: string) {
  try {
    const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
    const config = JSON.parse(tssrc);
    delete config[key];
    fs.writeFileSync(CONFIGURATION_FILE, JSON.stringify(config, null, 2));
  } catch (exp) {
    throw new ConfigurationError(exp);
  }
}
