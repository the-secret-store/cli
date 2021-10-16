import { login } from './services/auth.service';
import { exposeEnvAsObject } from './utilities/envHandler';

export default [
  {
    name: 'login',
    description: 'Login to you Secret Store account',
    action: login
  },
  {
    name: 'list',
    description: 'List secrets in the local version of the env file',
    action: async () => {
      const secrets = await exposeEnvAsObject(process.cwd());
      console.log(secrets);
    }
  }
];
