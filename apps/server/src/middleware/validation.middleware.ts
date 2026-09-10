import type { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export function validate<T extends Record<string, unknown>>(schema: z.ZodType<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const validatedBody = schema.parse(req.body);
    req.validatedBody = validatedBody;
    next();
  };
}
