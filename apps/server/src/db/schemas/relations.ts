import { defineRelations } from 'drizzle-orm';
import * as schema from './index.js';

export const relations = defineRelations(schema);
