import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const postsTable = pgTable('post', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
