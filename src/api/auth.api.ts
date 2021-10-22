import axios, { AxiosError } from 'axios';
import pc from 'picocolors';
import instance from '../config/axios';
import { AuthenticationError } from '../errors';
import { getConfiguration } from '../services/config.service';
import { ApiResponseError, ApiResponseSuccess } from './ApiResponse.interface';

export interface Credentials {
  email: string;
  password: string;
}

export interface TokenPair {
  authToken: string;
  refreshToken: string;
}

export interface ValidResponse extends ApiResponseSuccess {
  data: {
    tokens: TokenPair;
    message: string;
    token_type: string;
  };
}

export async function sendLoginRequest(credentials: Credentials): Promise<TokenPair> {
  try {
    const response: ValidResponse = await instance.post('auth/login', credentials);
    console.log(pc.green(response.data.message));
    return response.data.tokens;
  } catch (err) {
    const error = err as AxiosError;
    throw new AuthenticationError(
      (error.response as ApiResponseError).data.message,
      error
    );
  }
}

export async function requestNewTokenPair(): Promise<TokenPair> {
  try {
    const ins = axios.create({
      baseURL: process.env.BASE_URL,
      headers: {
        Authorization: `Bearer ${getConfiguration('refreshToken')}`
      }
    });

    const response: ValidResponse = await ins.put('auth/refresh');
    console.log(pc.green(response.data.message));
    return response.data.tokens;
  } catch (err) {
    const error = err as AxiosError;
    throw new AuthenticationError(
      (error.response as ApiResponseError).data.message,
      error
    );
  }
}
