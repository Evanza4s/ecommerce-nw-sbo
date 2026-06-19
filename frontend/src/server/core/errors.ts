export class ApiError extends Error {
  public code: number;
  public status: string;
  public data: any;

  constructor(message: string, code: number = 500, status: string = 'error', data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error: any): never => {
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error.name === 'AbortError') {
    throw new ApiError('Request timeout', 408, 'timeout');
  }

  throw new ApiError(
    error.message || 'An unexpected error occurred',
    500,
    'error'
  );
};
