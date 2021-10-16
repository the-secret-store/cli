import { AxiosError } from 'axios';
import instance from '../config/axios';
import { ApplicationError } from '../errors/ApplicationError';

export interface CreateProjectDto {
  projectName: string;
  owner: string;
  scope: 'public' | 'private';
}

export async function createNewProject({
  projectName,
  owner,
  scope
}: CreateProjectDto): Promise<string> {
  try {
    const {
      message,
      data: { app_id }
    } = (<ApiResponseSuccess>await instance.post('/project/create', {
      project_name: projectName,
      owner,
      scope
    })).data;

    console.log(`${message} \napp_id: ${app_id}`);
    return app_id;
  } catch (error) {
    throw new ApplicationError(
      (<ApiResponseError>(<AxiosError>error).response).data.message
    );
  }
}
