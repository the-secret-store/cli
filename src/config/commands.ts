import { exec } from 'child_process';
import { homedir } from 'os';
import path from 'path';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { ProjectService } from '../services/projects.service';
import { exposeEnvAsObject } from '../utilities/envHandler';

export default [
  {
    name: 'auth',
    description: 'Get details of current user',
    action: AuthService.currentSessionDetails
  },
  {
    name: 'login',
    description: 'Login to your Secret Store account',
    action: AuthService.login
  },
  {
    name: 'logout',
    description: 'Logout of your Secret Store account',
    action: AuthService.logout
  },
  {
    name: 'init',
    description:
      'Create a new project from current directory (requires pre-existing package.json)',
    action: async () => await ProjectService.createProject(process.cwd())
  },
  {
    name: 'list',
    description: 'List secrets in the local version of the env file',
    action: async () => {
      const secrets = await exposeEnvAsObject(process.cwd());
      console.log(secrets);
    }
  },
  {
    name: 'fetch',
    description: 'Fetch and update secrets from the store',
    action: async () => await ProjectService.fetchSecrets(process.cwd())
  },
  {
    name: 'post',
    description: 'Post local secrets to the cloud store',
    action: async () => await ProjectService.postSecrets(process.cwd())
  },
  {
    name: 'configure',
    description: 'Edit the .tssrc file in your preferred editor',
    action: async () => {
      exec(
        `${await ConfigService.getConfiguration('preferredEditor')} ${path.resolve(
          homedir(),
          '.tssrc'
        )}`
      );
    }
  },
  {
    name: 'edit',
    description: 'Edit .env file in your preferred editor',
    action: async () => {
      exec(
        `${await ConfigService.getConfiguration('preferredEditor')} ${path.resolve(
          process.cwd(),
          '.env'
        )}`
      );
    }
  }
];
