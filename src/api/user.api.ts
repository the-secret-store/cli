import { AxiosError } from 'axios';
import instance from '../config/axios';
import { ApplicationError } from '../errors';
import { TokenExpired } from '../errors/TokenExpired.error';
import { ApiResponseError, ApiResponseSuccess } from './ApiResponse.interface';

export interface TeamDetail {
  team_name: string;
  team_id: string;
}

export async function getTeams(): Promise<Array<TeamDetail>> {
  try {
    const { data: teams } = (<ApiResponseSuccess>await instance.get('/user/getTeams'))
      .data;

    return teams;
  } catch (error) {
    const response = <ApiResponseError>(error as AxiosError).response;
    if (response.status === 403 && response.data.message.includes('Token expired')) {
      throw new TokenExpired();
    }
    throw new ApplicationError(response.data.message, error as Error);
  }
}
