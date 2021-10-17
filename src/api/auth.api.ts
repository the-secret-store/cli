import { AxiosError } from 'axios';
import instance from '../config/axios';
import { AuthenticationError } from '../errors';

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
    console.log(response.data.message);
    return response.data.token;
  } catch (err) {
    throw new AuthenticationError(
      (<ApiResponseError>(<AxiosError>err).response).data.message
    );
  }
}
