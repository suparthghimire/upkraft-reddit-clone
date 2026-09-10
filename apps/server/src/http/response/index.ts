import type { Response } from 'express';
import type { ApiResponse } from '@reddit-clone/shared';

export type ResponseFormat<T = unknown> = ApiResponse<T>;

export function formatResponse<T>(args: ResponseFormat<T>): ResponseFormat<T> {
  return {
    message: args.message,
    statusCode: args.statusCode,
    data: args.data ?? null,
  };
}

export function sendResponse<T>(
  args: {
    res: Response;
  } & ResponseFormat<T>,
) {
  const { res, ...others } = args;
  return res.status(others.statusCode).json(others);
}
