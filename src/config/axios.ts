import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ConfigurationError } from '../errors';

const instance = axios.create({ baseURL: process.env.BASE_URL });

instance.defaults.headers.common['UserAgentToken'] = process.env.USER_AGENT_TOKEN || 'CLI';

const rc = path.resolve(os.homedir(), '.tssrc');

try {
  const tssrc = fs.readFileSync(rc, 'utf8');
  const config = JSON.parse(tssrc);
  const AUTH_TOKEN = config.authToken;
  console.log(AUTH_TOKEN);

  instance.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
} catch (err) {
  throw new ConfigurationError(err);
}

export default instance;
