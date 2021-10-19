import { AxiosError } from 'axios';
import pc from 'picocolors';
import instance from '../config/axios';
import { AuthenticationError } from '../errors';
import { ApiResponseError, ApiResponseSuccess } from './ApiResponse.interface';

export interface Credentials {
  email: string;
  password: string;
}

export interface ValidResponse extends ApiResponseSuccess {
  data: { token: string; message: string; token_type: string };
}

export async function sendLoginRequest(credentials: Credentials): Promise<string> {
  try {
    const response: ValidResponse = await instance.post('auth/login', credentials);
    console.log(pc.green(response.data.message));
    return response.data.token;
  } catch (err) {
    throw new AuthenticationError(
      (<ApiResponseError>(<AxiosError>err).response).data.message,
      err as Error
    );
  }
}
