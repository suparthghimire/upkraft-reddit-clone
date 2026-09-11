export type ApiResponse<T = unknown> = {
  message: string;
  statusCode: number;
  data: T | null;
};
