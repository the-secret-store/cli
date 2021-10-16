import fs from 'fs';
import prompts, { PromptObject } from 'prompts';
import { createNewProject } from '../api/projects.api';
import { getUserDetails } from '../utilities/tokenHandler';

export async function createProject(dir: string) {
  const packageJsonFile = `${dir}/package.json`;
  const packageJson = await import(packageJsonFile);
  const { name: packageName } = packageJson;
  if (packageJson.hasOwnProperty('tssProjectId')) {
    console.log('Project is already initialized.');
  }

  const questions: PromptObject<string>[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Name of the project',
      initial: packageName
    },
    {
      type: 'text',
      name: 'owner',
      message: 'Project owner (Unique OID of the team/user)',
      initial: getUserDetails().id
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
  // todo: add spinner
  const app_id = await createNewProject({ projectName, owner, scope });

  packageJson.default.tssProjectId = app_id;
  fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson.default));

  console.log(
    '\nProject id has been added to package.json. \nYou might wanna reformat your package.json for readability.'
  );
}
