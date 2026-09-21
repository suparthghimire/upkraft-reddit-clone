import { index, integer, pgEnum, pgTable, timestamp, unique } from 'drizzle-orm/pg-core';
import { postsTable } from './post.table.js';
import { usersTable } from './user.table.js';

export const voteType = pgEnum('vote_type', ['upvote', 'downvote']);

export const postUserVotesTable = pgTable(
  'post_user_votes',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    post_id: integer()
      .notNull()
      .references(() => postsTable.id),
    user_id: integer()
      .notNull()
      .references(() => usersTable.id),
    vote_type: voteType().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp(),
  },
  (table) => {
    return [
      index('post_id_idx').on(table.post_id),
      unique('post_user_vote_type_unique').on(table.post_id, table.user_id, table.vote_type),
    ];
  },
);
