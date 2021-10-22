import axios from 'axios';
import { ConfigService } from '../services/config.service';

const BASE_URL = 'http://localhost:5000'; // in dev

const instance = axios.create({ baseURL: BASE_URL });

instance.defaults.headers.common['UserAgentToken'] =
  process.env.USER_AGENT_TOKEN || 'CLI';

try {
  const AUTH_TOKEN = ConfigService.getConfiguration('authToken') || '';
  instance.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
} catch (err) {
  // ? we don't wanna throw, coz we wanna let users login without rc file/ authToken
}

export default instance;
