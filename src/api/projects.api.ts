import { AxiosError } from 'axios';
import pc from 'picocolors';
import instance from '../config/axios';
import { ApplicationError } from '../errors';
import { TokenExpired } from '../errors/TokenExpired.error';
import { ENVObjectType } from '../utilities/envHandler';
import { ApiResponseError, ApiResponseSuccess } from './ApiResponse.interface';

export interface CreateProjectDto {
  projectName: string;
  owner: string;
  scope: 'public' | 'private';
}

export class ProjectsApi {
  static async createNewProject({
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

      console.log(pc.green(message));
      return app_id;
    } catch (error) {
      const response = <ApiResponseError>(error as AxiosError).response;
      if (response.status === 403 && response.data.message.includes('Token expired')) {
        throw new TokenExpired();
      }
      throw new ApplicationError(response.data.message, error as Error);
    }
  }

  static async getSecretsFromStore(projectIdOrAppId: string): Promise<ENVObjectType> {
    try {
      const response: ApiResponseSuccess = await instance.get(
        `/project/${projectIdOrAppId}/fetch`
      );

      const { secrets } = response.data.data;
      return secrets;
    } catch (error) {
      const response = <ApiResponseError>(error as AxiosError).response;
      if (response.status === 403 && response.data.message.includes('Token expired')) {
        throw new TokenExpired();
      }
      throw new ApplicationError(response.data.message, error as Error);
    }
  }

  static async postSecretsToTheStore(projectIdOrAppId: string, secrets: ENVObjectType) {
    try {
      await instance.put(`/project/${projectIdOrAppId}/post`, { secrets });
    } catch (error) {
      const response = <ApiResponseError>(error as AxiosError).response;
      if (response.status === 403 && response.data.message.includes('Token expired')) {
        throw new TokenExpired();
      }
      throw new ApplicationError(response.data.message, error as Error);
    }
  }
}
