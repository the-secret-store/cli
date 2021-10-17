import { currentSessionDetails, login, logout } from '../services/auth.service';
import { createProject } from '../services/projects.service';
import { exposeEnvAsObject } from '../utilities/envHandler';

export default [
  {
    name: 'auth',
    description: 'Get details of current user',
    action: currentSessionDetails
  },
  {
    name: 'login',
    description: 'Login to your Secret Store account',
    action: login
  },
  {
    name: 'logout',
    description: 'Logout of your Secret Store account',
    action: logout
  },
  {
    name: 'init',
    description:
      'Create a new project from current directory (requires pre-existing package.json)',
    action: async () => await createProject(process.cwd())
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
