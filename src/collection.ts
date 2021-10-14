import { exposeEnvAsObject } from './utilities/envHandler';

export default [
  {
    name: 'init',
    description: 'Initialize a Secret Store project (creates and pushes project)',
    action: () => {
      console.log('Init');
    }
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
