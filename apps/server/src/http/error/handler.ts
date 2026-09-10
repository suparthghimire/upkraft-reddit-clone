import { z, ZodError } from 'zod';
import { CustomError } from './customError.js';
import type { ResponseFormat } from '../response/index.js';

export class ErrorHandler {
  constructor(private readonly error: any) {}

  // Based on instance of err, return the response payload
  handle(): ResponseFormat {
    if (this.error instanceof ZodError) {
      return this.handleZodError(this.error);
    } else if (this.error instanceof CustomError) {
      return this.handleCustomError(this.error);
    } else if (this.error instanceof Error) {
      return this.handleJSError(this.error);
    }

    return {
      message: 'Internal server error',
      data: null,
      statusCode: 500,
    };
  }

  handleCustomError(err: CustomError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      data: err.data ?? null,
    };
  }

  handleJSError(err: Error) {
    return {
      statusCode: 500,
      message: err.message || 'Internal server error',
      data: null,
    };
  }

  handleZodError(err: ZodError) {
    return {
      statusCode: 422,
      message: 'Validation failed',
      data: z.treeifyError(err),
    };
  }
}
