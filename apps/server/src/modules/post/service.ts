import type { PostCreateInput, PostUpdateInput } from '@reddit-clone/shared';
import { dbInstance } from '../../db/connection.js';
import { postsTable } from '../../db/schemas/post.schema.js';
import { eq } from 'drizzle-orm';

export function getAllPosts() {
  return dbInstance.query.postsTable.findMany();
}

export function getPostById(postId: number) {
  return dbInstance.query.postsTable.findFirst({
    where: {
      id: postId,
    },
  });
}

export function createPost(post: PostCreateInput) {
  return dbInstance.insert(postsTable).values(post);
}

export function updatePost(postId: number, post: PostUpdateInput) {
  return dbInstance.update(postsTable).set(post).where(eq(postsTable.id, postId));
}

export function deletePost(postId: number) {
  return dbInstance.delete(postsTable).where(eq(postsTable.id, postId));
}
