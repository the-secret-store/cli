import instance from '../config/axios';
import { AuthenticationError } from '../errors/Authentication.error';

export interface Credentials {
  email: string;
  password: string;
}

export interface ValidResponse {
  data: { token: string; message: string; token_type: string };
}

export async function sendLoginRequest(
  credentials: Credentials
): Promise<string> {
  try {
    const response: ValidResponse = await instance.post(
      'auth/login',
      credentials
    );
    console.log(response.data.message);
    return response.data.token;
  } catch (err) {
    throw new AuthenticationError((<any>err).response.data.message);
  }
}
