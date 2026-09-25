import type { Request, Response } from 'express';
import { sendResponse } from '../../http/response/index.js';
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostBySlug,
  searchPosts,
  votePost,
  countAllPosts,
} from './service.js';
import { z } from 'zod';
import { CustomError } from '../../http/error/customError.js';
import { queryParamSchema, type PostCreateInput, type PostUpdateInput } from '@reddit-clone/shared';

export async function postIndexHandler(req: Request, res: Response) {
  const queryParams = queryParamSchema.parse(req.query);

  const $posts = searchPosts(queryParams);
  const $postsCount = countAllPosts();

  const [posts, postsCount] = await Promise.all([$posts, $postsCount]);

  return sendResponse({
    res,
    data: posts,
    message: 'Posts retrieved successfully',
    statusCode: 200,
    count: postsCount,
  });
}

export async function postRetrieveHandler(req: Request, res: Response) {
  const id = req.params.id;

  const { success: isValidId, data: numericId } = z.number().safeParse(Number(id));

  if (!isValidId) throw new CustomError('Invalid ID', 400);

  const post = await getPostById(numericId);

  if (!post) throw new CustomError('Post not found', 404);

  return sendResponse({
    res,
    data: post,
    message: 'Post retrieved successfully',
    statusCode: 200,
  });
}

export async function postRetrieveBySlugHandler(req: Request, res: Response) {
  const slug = req.params.slug;

  // Assert slug is valid string
  const { success: isValidString, data: parsedSlug } = z.string().safeParse(slug);

  if (!isValidString) throw new CustomError('Invalid slug', 400);

  const post = await getPostBySlug(parsedSlug);

  if (!post) throw new CustomError('Post not found', 404);

  return sendResponse({
    res,
    data: post,
    message: 'Post retrieved successfully',
    statusCode: 200,
  });
}

export async function postCreateHandler(req: Request, res: Response) {
  const validatedBody = req.validatedBody as PostCreateInput;
  const user = res.locals.user;

  await createPost({ post: validatedBody, userId: user.id });

  return sendResponse({
    res,
    data: null,
    message: 'Post created successfully',
    statusCode: 201,
  });
}

export async function postUpdateHandler(req: Request, res: Response) {
  const id = z.number().parse(Number(req.params.id));
  const validatedBody = req.validatedBody as PostUpdateInput;

  await updatePost(id, validatedBody);

  return sendResponse({
    res,
    data: null,
    message: 'Post updated successfully',
    statusCode: 201,
  });
}

export async function postVoteHandler(req: Request, res: Response) {
  const id = z.number().parse(Number(req.params.id));
  const voteType = z.enum(['upvote', 'downvote']).parse(req.params.voteType);

  const result = await votePost({
    postId: id,
    userId: res.locals.user.id,
    voteType: voteType,
  });

  return sendResponse({
    res,
    data: result,
    message: 'Post voted successfully',
    statusCode: 200,
  });
}

export async function postDeleteHandler(req: Request, res: Response) {
  const id = z.number().parse(Number(req.params.id));

  await deletePost(id);

  return sendResponse({
    res,
    data: null,
    message: 'Post deleted successfully',
    statusCode: 201,
  });
}
