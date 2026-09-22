import z from 'zod';

export const queryParamSchema = z.looseObject({
  title: z.string().optional(),
  ids: z.array(z.number()).optional(),
});

export type QueryParamSchema = z.infer<typeof queryParamSchema>;
