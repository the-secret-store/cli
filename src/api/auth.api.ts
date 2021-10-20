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
  data: {
    tokens: { authToken: string; refreshToken: string };
    message: string;
    token_type: string;
  };
}

export async function sendLoginRequest(
  credentials: Credentials
): Promise<{ authToken: string; refreshToken: string }> {
  try {
    const response: ValidResponse = await instance.post('auth/login', credentials);
    console.log(pc.green(response.data.message));
    return response.data.tokens;
  } catch (err) {
    throw new AuthenticationError(
      (<ApiResponseError>(<AxiosError>err).response).data.message,
      err as Error
    );
  }
}
