import z from 'zod';

export const queryParamSchema = z.looseObject({
  title: z.string().optional(),
  ids: z.array(z.number()).optional(),
  q: z.string().optional(),
  limit: z.number().optional(),
  sortKey: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type QueryParamSchema = z.infer<typeof queryParamSchema>;
