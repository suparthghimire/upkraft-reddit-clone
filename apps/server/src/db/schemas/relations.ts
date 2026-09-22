import { defineRelations } from 'drizzle-orm';
import * as schema from './index.js';

export const appRelations = defineRelations(
  {
    usersTable: schema.usersTable,
    postsTable: schema.postsTable,
    postUserVotesTable: schema.postUserVotesTable,
    commentsTable: schema.commentsTable,
  },
  (r) => ({
    postsTable: {
      votes: r.many.postUserVotesTable({
        from: r.postsTable.id,
        to: r.postUserVotesTable.post_id,
      }),
      user: r.one.usersTable({
        from: r.postsTable.user_id,
        to: r.usersTable.id,
      }),
      comments: r.many.commentsTable({
        from: r.postsTable.id,
        to: r.commentsTable.post_id,
      }),
    },
    usersTable: {
      votes: r.many.postUserVotesTable({
        from: r.usersTable.id,
        to: r.postUserVotesTable.user_id,
      }),
      posts: r.many.postsTable({
        from: r.usersTable.id,
        to: r.postsTable.user_id,
      }),
      comments: r.many.commentsTable({
        from: r.usersTable.id,
        to: r.commentsTable.user_id,
      }),
    },
    postUserVotesTable: {
      post: r.one.postsTable({
        from: r.postUserVotesTable.post_id,
        to: r.postsTable.id,
      }),
      user: r.one.usersTable({
        from: r.postUserVotesTable.user_id,
        to: r.usersTable.id,
      }),
    },

    commentsTable: {
      user: r.one.usersTable({
        from: r.commentsTable.user_id,
        to: r.usersTable.id,
      }),
      post: r.one.postsTable({
        from: r.commentsTable.post_id,
        to: r.postsTable.id,
      }),
      parentComment: r.one.commentsTable({
        from: r.commentsTable.parent_comment_id,
        to: r.commentsTable.id,
      }),
      childComments: r.many.commentsTable({
        from: r.commentsTable.id,
        to: r.commentsTable.parent_comment_id,
      }),
    },
  }),
);

export const relations = defineRelations({ schema });
