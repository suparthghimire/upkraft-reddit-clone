import type { PostCreateInput, PostUpdateInput, QueryParamSchema } from '@reddit-clone/shared';
import { dbInstance } from '../../db/connection.js';
import { postsTable } from '../../db/schemas/modules/post.table.js';
import { and, eq, QueryPromise } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { userColumns } from '../user/services.js';
import { postUserVotesTable } from '../../db/schemas/index.js';
import { CustomError } from '../../http/error/customError.js';
import { getSimilarEmbeddings, splitTextIntoChunks, storeEmbedding } from '../qdrant/services.js';
import fs from 'fs/promises';
export function postColumns() {
  return {
    id: true,
    content: true,
    title: true,
    created_at: true,
    slug: true,
    updated_at: true,
    total_upvotes: true,
    total_downvotes: true,
  } as const;
}

export function getAllPosts(queryParams?: QueryParamSchema) {
  const { title, limit, sortKey, sortOrder, ids } = queryParams ?? {};
  return dbInstance.query.postsTable.findMany({
    columns: postColumns(),
    where: {
      ...(title
        ? {
            title: {
              like: `%${title}%`,
            },
          }
        : undefined),
      ...(ids ? { id: { in: ids } } : undefined),
    },
    with: {
      user: {
        columns: userColumns(),
      },
    },
    limit: limit,
    orderBy: sortKey
      ? {
          [sortKey]: sortOrder ?? 'asc',
        }
      : undefined,
  });
}

export async function countAllPosts() {
  return dbInstance.$count(postsTable);
}

export async function searchPosts(queryParams?: QueryParamSchema) {
  if (!queryParams) {
    // Get all posts uptp 10 items
    return getAllPosts(queryParams);
  }

  if (queryParams.q) {
    // Find relevant posts based on query string from qdrant
    const similarPosts = await getSimilarEmbeddings<{ id: number; title: string; content: string }>(
      {
        query: queryParams.q,
        limit: queryParams.limit,
      },
    );

    // Get unique posts based on their ids
    const uniqueIds = [...new Set(similarPosts.map((post) => post.id))];

    return getAllPosts({
      ...queryParams,
      ids: uniqueIds,
    });
  }

  return getAllPosts(queryParams);
}

export function getPostById(postId: number) {
  return dbInstance.query.postsTable.findFirst({
    columns: postColumns(),

    where: {
      id: postId,
    },
    with: {
      user: {
        columns: userColumns(),
      },
      votes: true,
    },
  });
}

export function getPostBySlug(slug: string) {
  return dbInstance.query.postsTable.findFirst({
    columns: postColumns(),
    where: {
      slug: slug,
    },
    with: {
      user: {
        columns: userColumns(),
      },
      votes: true,
    },
  });
}

export async function createPost(args: { post: PostCreateInput; userId: number }) {
  const { post, userId } = args;
  const slug = post.title.toLowerCase().replaceAll(' ', '-') + '-' + nanoid(6);

  const [row] = await dbInstance
    .insert(postsTable)
    .values({ ...post, slug, user_id: userId })
    .returning({
      id: postsTable.id,
    });

  if (!row) throw new CustomError('Failed to create post', 500);

  const { id } = row;

  await storeEmbedding({
    id,
    title: post.title,
    content: post.content,
  });

  return true;
}

export async function votePost(args: {
  postId: number;
  userId: number;
  voteType: 'upvote' | 'downvote';
}) {
  const { postId, userId, voteType } = args;

  return dbInstance.transaction(async (tx) => {
    const [post] = await tx
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId))
      .for('update');

    if (!post) throw new CustomError('Post not found', 404);

    const [existingVote] = await tx
      .select()
      .from(postUserVotesTable)
      .where(
        and(
          eq(postUserVotesTable.post_id, postId),
          eq(postUserVotesTable.user_id, userId),
          eq(postUserVotesTable.vote_type, voteType),
        ),
      )
      .for('update');

    const nextVote = existingVote?.vote_type === voteType ? null : voteType;
    const upvoteDelta =
      (nextVote === 'upvote' ? 1 : 0) - (existingVote?.vote_type === 'upvote' ? 1 : 0);

    const downvoteDelta =
      (nextVote === 'downvote' ? 1 : 0) - (existingVote?.vote_type === 'downvote' ? 1 : 0);

    const totalUpvotes = Math.max(0, post.total_upvotes + upvoteDelta);
    const totalDownvotes = Math.max(0, post.total_downvotes + downvoteDelta);

    await tx
      .update(postsTable)
      .set({
        total_upvotes: totalUpvotes,
        total_downvotes: totalDownvotes,
      })
      .where(eq(postsTable.id, postId));

    if (!existingVote && nextVote) {
      await tx.insert(postUserVotesTable).values({
        post_id: postId,
        user_id: userId,
        vote_type: nextVote,
      });
    } else if (existingVote && nextVote) {
      await tx
        .update(postUserVotesTable)
        .set({ vote_type: nextVote })
        .where(eq(postUserVotesTable.id, existingVote.id));
    } else if (existingVote) {
      await tx.delete(postUserVotesTable).where(eq(postUserVotesTable.id, existingVote.id));
    }

    return {
      voteType: nextVote,
      totalUpvotes,
      totalDownvotes,
    };
  });
}

export function updatePost(postId: number, post: PostUpdateInput) {
  return dbInstance.update(postsTable).set(post).where(eq(postsTable.id, postId));
}

export function deletePost(postId: number) {
  return dbInstance.delete(postsTable).where(eq(postsTable.id, postId));
}
