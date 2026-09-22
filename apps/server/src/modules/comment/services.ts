import type { CreateCommentSchema } from '@reddit-clone/shared';
import { dbInstance } from '../../db/connection.js';
import { commentsTable, postsTable } from '../../db/schemas/index.js';
import { userColumns } from '../user/services.js';
import { count, eq } from 'drizzle-orm';
import { CustomError } from '../../http/error/customError.js';

export async function getAllCommentsForPost(args: { postId: number }) {
  const { postId } = args;

  // Check if post exists
  const [postCount] = await dbInstance
    .select({
      count: count(),
    })
    .from(postsTable)
    .where(eq(postsTable.id, postId));

  if (!postCount || postCount.count <= 0) {
    throw new CustomError('Post not found', 404);
  }

  return dbInstance.query.commentsTable.findMany({
    where: {
      post_id: postId,
      parent_comment_id: { isNull: true },
    },
    with: {
      user: {
        columns: userColumns(),
      },
      childComments: {
        with: {
          childComments: {
            with: {
              childComments: {
                with: {
                  user: true,
                },
              },
              user: true,
            },
          },
          user: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function createNewComment(args: {
  postId: number;
  payload: CreateCommentSchema;
  userId: number;
}) {
  const { postId, payload } = args;

  // Check if post exists
  const [postCount] = await dbInstance
    .select({
      count: count(),
    })
    .from(postsTable)
    .where(eq(postsTable.id, postId));

  if (!postCount || postCount.count <= 0) {
    throw new CustomError('Post not found', 404);
  }

  if (payload.parentCommentId) {
    // Check if comment exists
    const [commentCount] = await dbInstance
      .select({
        count: count(),
      })
      .from(commentsTable)
      .where(eq(commentsTable.id, payload.parentCommentId));

    if (!commentCount || commentCount.count <= 0) {
      throw new CustomError('Parent comment not found', 404);
    }
  }

  return dbInstance.insert(commentsTable).values({
    post_id: postId,
    text: payload.text,
    user_id: args.userId,
    parent_comment_id: payload.parentCommentId,
  });
}
