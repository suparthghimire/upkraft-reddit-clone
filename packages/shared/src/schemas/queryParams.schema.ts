import z from 'zod';

export const queryParamSchema = z.looseObject({
  title: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type QueryParamSchema = z.infer<typeof queryParamSchema>;
