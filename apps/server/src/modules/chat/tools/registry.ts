import type { ToolSet } from 'ai';
import { searchKbTool } from './searchKb.tool.schema.js';

export const toolRegistry: ToolSet = {
  search_kb: searchKbTool,
};
