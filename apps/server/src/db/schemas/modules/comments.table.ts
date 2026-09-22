import { index, integer, pgTable, text, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { postsTable } from './post.table.js';
import { usersTable } from './user.table.js';
import { timestamp } from 'drizzle-orm/cockroach-core';

export const commentsTable = pgTable(
  'comment',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    post_id: integer()
      .notNull()
      .references(() => postsTable.id),
    user_id: integer()
      .notNull()
      .references(() => usersTable.id),
    text: text().notNull(),
    parent_comment_id: integer().references((): AnyPgColumn => commentsTable.id),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().$onUpdateFn(() => new Date()),
  },
  (table) => {
    return [
      index('comment_post_id_idx').on(table.post_id),
      index('comment_parent_comment_id_idx').on(table.parent_comment_id),
      index('comment_user_id_idx').on(table.user_id),
    ];
  },
);
