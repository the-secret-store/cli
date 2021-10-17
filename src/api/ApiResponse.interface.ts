import { AxiosResponse } from 'axios';

export interface ApiResponse extends AxiosResponse {
  data: {
    message: string;
  };
}

export interface ApiResponseError extends ApiResponse {
  data: { message: string; details?: any };
}

export interface ApiResponseSuccess extends ApiResponse {
  data: { message: string; data?: any };
}
