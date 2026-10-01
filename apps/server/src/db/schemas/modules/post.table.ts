import { integer, pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { usersTable } from './user.table.js';

export const postsTable = pgTable(
  'post',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    content: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    // Add a foreign key to the user table
    user_id: integer()
      .notNull()
      .references(() => usersTable.id),
    // Create a slug
    slug: text().unique().notNull(),

    imageKeys: text().array().default([]).notNull(),

    total_upvotes: integer().notNull().default(0),
    total_downvotes: integer().notNull().default(0),

    updated_at: timestamp()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return [index('title_idx').on(table.title)];
  },
);

// Table to store post and upvote/downvited user ids

export type PostTable = typeof postsTable.$inferSelect;
