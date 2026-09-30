import { ai } from '@reddit-clone/shared';
import { searchKbTool } from './schemas/search_kb.tool.schema.js';

export const toolRegistry: ai.ToolSet = {
  search_kb: searchKbTool,
};
