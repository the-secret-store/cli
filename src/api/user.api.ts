import { AxiosError } from 'axios';
import instance from '../config/axios';
import { ApplicationError } from '../errors';

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
    throw new ApplicationError(
      (<ApiResponseError>(<AxiosError>error).response).data.message
    );
  }
}
