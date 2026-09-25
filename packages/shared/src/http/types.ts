export type ApiResponse<T = null> = {
  message: string;
  statusCode: number;
  data?: T | null;
  count?: number | undefined;
};
