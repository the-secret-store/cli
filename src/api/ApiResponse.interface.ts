interface ApiResponse {
  message: string;
}

interface ApiResponseError extends ApiResponse {
  details?: any;
}

interface ApiResponseSuccess extends ApiResponse {
  data?: any;
}
