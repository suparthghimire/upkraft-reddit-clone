import { tool } from 'ai';
import { z } from 'zod';
import { getRelavantPosts } from '../../post/service.js';

export const searchKbTool = tool({
  description: 'Search the knowledge base',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().min(1).max(10).optional(),
  }),
  execute: async ({ query, limit }) => {
    return await getRelavantPosts({ query, limit });
  },
});
