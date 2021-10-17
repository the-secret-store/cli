import fs from 'fs';
import os from 'os';
import path from 'path';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigurationError } from '../errors';
import { getConfiguration } from '../services/config.service';

const CONFIGURATION_FILE = path.resolve(os.homedir(), '.tssrc');

export interface TokenPayload extends JwtPayload {
  id: string;
  display_name: string;
  unverified: boolean;
}

export function getAuthToken() {
  try {
    const tssrc = fs.readFileSync(CONFIGURATION_FILE, 'utf8');
    const config = JSON.parse(tssrc);

    return config.authToken;
  } catch (error) {
    throw new ConfigurationError(error);
  }
}

export function getTokenPayload() {
  try {
    const token = getConfiguration('authToken');
    const details: TokenPayload = <TokenPayload>jwt.decode(token);

    return details;
  } catch (error) {
    throw new ConfigurationError(error);
  }
}
