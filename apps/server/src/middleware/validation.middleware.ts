import type { z } from 'zod';
import { postCreateSchema } from '../modules/post/schemas/create.schema.js';
import type { NextFunction, Request, Response } from 'express';

export function validate<T extends Record<string, any>>(schema: z.ZodType<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const validatedBody = schema.parse(req.body);
    req.validatedBody = validatedBody;
    next();
  };
}
