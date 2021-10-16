interface ApiResponse {
  data: {
    message: string;
  };
}

interface ApiResponseError extends ApiResponse {
  data: { message: string; details?: any };
}

interface ApiResponseSuccess extends ApiResponse {
  data: { message: string; data?: any };
}
