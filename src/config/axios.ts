import axios from 'axios';
import { ConfigurationError } from '../errors';
import { getAuthToken } from '../utilities/tokenHandler';

const instance = axios.create({ baseURL: process.env.BASE_URL });

instance.defaults.headers.common['UserAgentToken'] =
  process.env.USER_AGENT_TOKEN || 'CLI';

try {
  const AUTH_TOKEN = getAuthToken() || '';
  instance.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
} catch (err) {
  throw new ConfigurationError(err);
}

export default instance;
