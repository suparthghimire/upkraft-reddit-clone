import type { Response } from 'express';

export type ResponseFormat<T = unknown> = {
  message: string;
  statusCode: number;
  data: T | null;
};

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
