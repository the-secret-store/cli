import axios from 'axios';
import { getConfiguration } from '../services/config.service';

const instance = axios.create({ baseURL: process.env.BASE_URL });

instance.defaults.headers.common['UserAgentToken'] =
  process.env.USER_AGENT_TOKEN || 'CLI';

try {
  const AUTH_TOKEN = getConfiguration('authToken') || '';
  instance.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
} catch (err) {
  // ? we don't wanna throw, coz we wanna let users login without rc file/ authToken
}

export default instance;
