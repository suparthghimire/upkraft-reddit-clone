import { z, ZodError } from 'zod';
import { CustomError } from './customError.js';
import type { ResponseFormat } from '../response/index.js';
import jwt from 'jsonwebtoken';

export class ErrorHandler {
  constructor(private readonly error: unknown) {}

  // Based on instance of err, return the response payload
  handle(): ResponseFormat {
    console.log(this.error);

    if (this.error instanceof ZodError) {
      return this.handleZodError(this.error);
    } else if (this.error instanceof CustomError) {
      return this.handleCustomError(this.error);
    } else if (
      this.error instanceof jwt.JsonWebTokenError ||
      this.error instanceof jwt.NotBeforeError ||
      this.error instanceof jwt.TokenExpiredError
    ) {
      return this.handleJWTError();
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

  handleJWTError() {
    return {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
  }
}
