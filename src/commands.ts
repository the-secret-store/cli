import { login } from './services/auth.service';
import { createProject } from './services/projects.service';
import { exposeEnvAsObject } from './utilities/envHandler';

export default [
  {
    name: 'init',
    description:
      'Create a new project from current directory (requires pre-existing package.json)',
    action: async () => await createProject(process.cwd())
  },
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
