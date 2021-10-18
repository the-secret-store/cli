import { exec } from 'child_process';
import { homedir } from 'os';
import path from 'path';
import { currentSessionDetails, login, logout } from '../services/auth.service';
import { getConfigurations } from '../services/config.service';
import { createProject, fetchSecrets, postSecrets } from '../services/projects.service';
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
  },
  {
    name: 'fetch',
    description: 'Fetch and update secrets from the store',
    action: async () => await fetchSecrets(process.cwd())
  },
  {
    name: 'post',
    description: 'Post local secrets to the cloud store',
    action: async () => await postSecrets(process.cwd())
  },
  {
    name: 'configure',
    description: 'Edit the .tssrc file in your preferred editor',
    action: () => {
      exec(`${getConfigurations().preferredEditor} ${path.resolve(homedir(), '.tssrc')}`);
    }
  },
  {
    name: 'edit',
    description: 'Edit .env file in your preferred editor',
    action: () => {
      exec(
        `${getConfigurations().preferredEditor} ${path.resolve(process.cwd(), '.env')}`
      );
    }
  }
];
