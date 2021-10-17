import fs from 'fs';
import ora from 'ora';
import os from 'os';
import path from 'path';
import prompts, { PromptObject } from 'prompts';
import { createNewProject } from '../api/projects.api';
import { getTeams } from '../api/user.api';
import { getTokenPayload } from '../utilities/tokenHandler';

export async function createProject(dir: string) {
  const packageJsonFile = `${dir}/package.json`;

  const packageJson = await import(packageJsonFile);
  const { name: packageName } = packageJson;
  if (packageJson.hasOwnProperty('tssProjectId')) {
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
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson.default));

    spinner.succeed(`Project initialized successfully. app_id: ${app_id}`);
    console.log(
      '\nProject id has been added to package.json. \nYou might wanna reformat your package.json for readability.'
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
      gitIgnoreEditSpinner.fail('Failed to update gitignore.');
      console.log('Manually add .env and .env.backup to your gitignore');
      throw err;
    }
  } catch (error) {
    spinner.fail('Failed to initialize project.');
    throw error;
  }
}
