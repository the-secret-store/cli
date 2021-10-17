import { AxiosError } from 'axios';
import instance from '../config/axios';
import { ApplicationError } from '../errors';
import { ENVObjectType } from '../utilities/envHandler';
import { ApiResponseError, ApiResponseSuccess } from './ApiResponse.interface';

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

    console.log(message);
    return app_id;
  } catch (error) {
    if ((<AxiosError>error).response?.status) {
      throw new ApplicationError(
        (<ApiResponseError>(<AxiosError>error).response).data.message
      );
    }
    throw error;
  }
}

export async function getSecretsFromStore(
  projectIdOrAppId: string
): Promise<ENVObjectType> {
  try {
    const response: ApiResponseSuccess = await instance.get(
      `/project/${projectIdOrAppId}/fetch`
    );

    const { secrets } = response.data.data;
    return secrets;
  } catch (error) {
    throw new ApplicationError((<AxiosError>error).message);
  }
}

export async function postSecretsToTheStore(
  projectIdOrAppId: string,
  secrets: ENVObjectType
) {
  try {
    await instance.put(`/project/${projectIdOrAppId}/post`, { secrets });
  } catch (err) {
    throw new ApplicationError((<AxiosError>err).message);
  }
}
