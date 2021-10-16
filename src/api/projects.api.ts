import { AxiosError } from 'axios';
import instance from '../config/axios';
import { ApplicationError } from '../errors/ApplicationError';

export interface CreateProjectDto {
  projectName: string;
  owner: string;
  scope: 'public' | 'private';
}

export async function createNewProject({ projectName, owner, scope }: CreateProjectDto) {
  try {
    const res: ApiResponseSuccess = await instance.post('/project/create', {
      project_name: projectName,
      owner,
      scope
    });

    console.log(res.data.message);
  } catch (error) {
    throw new ApplicationError(
      (<ApiResponseError>(<AxiosError>error).response).data.message
    );
  }
}
