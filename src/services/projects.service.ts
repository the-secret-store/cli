import fs from 'fs';
import ora from 'ora';
import os from 'os';
import path from 'path';
import pc from 'picocolors';
import prompts, { PromptObject } from 'prompts';
import {
  createNewProject,
  getSecretsFromStore,
  postSecretsToTheStore
} from '../api/projects.api';
import { getTeams } from '../api/user.api';
import { ClientError, FileNotFoundError } from '../errors';
import { exportEnvFromObject, exposeEnvAsObject } from '../utilities/envHandler';
import prettyJson from '../utilities/prettyJson';
import { getTokenPayload } from '../utilities/tokenHandler';

export async function createProject(dir: string) {
  const packageJsonFile = path.resolve(dir, 'package.json');

  if (!fs.existsSync(packageJsonFile)) {
    console.error(pc.yellow('Node project is not detected in the current directory.'));
    throw new ClientError(
      'package.json not found',
      new FileNotFoundError(packageJsonFile)
    );
  }

  const packageJson = await import(packageJsonFile);

  const { name: packageName } = packageJson;
  if (Object.prototype.hasOwnProperty.call(packageJson, 'tssProjectId')) {
    console.log('Project is already initialized.');
  }

  const userDetails = getTokenPayload();
  const teams = (await getTeams()).map(team => ({
    title: team.team_name,
    value: team.team_id
  }));

  const questions: PromptObject<string>[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Name of the project',
      initial: packageName
    },
    {
      type: 'select',
      name: 'owner',
      message: 'Select ownership',
      choices: [{ title: userDetails.display_name, value: userDetails.id }, ...teams]
    },
    {
      type: 'select',
      name: 'scope',
      message: 'Scope of the project',
      choices: [
        { title: 'public', value: 'public' },
        { title: 'private', value: 'private' }
      ]
    }
  ];

  const { projectName, owner, scope } = await prompts(questions);

  const spinner = ora('Creating project...').start();

  try {
    const app_id = await createNewProject({ projectName, owner, scope });

    packageJson.default.tssProjectId = app_id;
    fs.writeFileSync(packageJsonFile, prettyJson(packageJson.default));

    spinner.succeed(
      `Project initialized successfully. app_id: ${pc.underline(pc.cyan(app_id))}`
    );
    console.log(
      '\nProject id has been added to package.json. \nYou might wanna reformat your package.json for readability.\n'
    );

    const gitIgnoreEditSpinner = ora('Updating gitignore...').start();
    try {
      const gitIgnoreFile = path.resolve(dir, '.gitignore');
      const gitIgnore = fs.readFileSync(gitIgnoreFile);
      fs.writeFileSync(
        gitIgnoreFile,
        gitIgnore + os.EOL + '.env' + os.EOL + '.env.backup'
      );
      gitIgnoreEditSpinner.succeed('.gitignore file has been updated.');
      console.log('Remember to commit the changes.');
    } catch (err) {
      // todo: create .gitignore file if it doesn't exist
      gitIgnoreEditSpinner.fail('Failed to update gitignore.');
      console.log('Manually add .env and .env.backup to your gitignore');
      throw new ClientError('Unable to find or modify .gitignore', err as Error);
    }
  } catch (error) {
    spinner.fail('Failed to initialize project.');
    throw error;
    // throw new ApplicationError('Failed to initialize project');
  }
}

export async function fetchSecrets(dir: string) {
  const spinner = ora('Fetching secrets from store...').start();

  try {
    const { tssProjectId } = await import(path.resolve(dir, 'package.json'));

    if (!tssProjectId) throw new ClientError('Not a Secret Store project');

    const secrets = await getSecretsFromStore(tssProjectId);
    exportEnvFromObject(secrets, dir);

    spinner.succeed('Secrets are fetched and stored locally.');
    console.log(prettyJson(secrets));
  } catch (err) {
    spinner.fail('Failed to fetch secrets.');
    throw err;
  }
}

export async function postSecrets(dir: string) {
  const spinner = ora('Posting secrets to the store...').start();

  try {
    const { tssProjectId } = await import(path.resolve(dir, 'package.json'));

    if (!tssProjectId) throw new ClientError('Not a Secret Store project');

    const secrets = await exposeEnvAsObject(dir);
    await postSecretsToTheStore(tssProjectId, secrets);
    spinner.succeed('Secrets have been posted to the store.');
  } catch (err) {
    spinner.fail('Failed to post secrets.');
    throw err;
  }
}
