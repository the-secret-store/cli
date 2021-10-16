import prompts, { PromptObject } from 'prompts';
import { createNewProject } from '../api/projects.api';
import { getUserDetails } from '../utilities/tokenHandler';

export async function createProject(dir: string) {
  const packageJson = await import(`${dir}/package.json`);
  const { name: packageName } = packageJson;

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
  await createNewProject({ projectName, owner, scope });
}
