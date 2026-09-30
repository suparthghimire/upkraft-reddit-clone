import { integer, pgTable, json, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './user.table.js';

export const aiUsageTable = pgTable('ai-usage', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
  usageJSON: json().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().$onUpdateFn(() => new Date()),
});
