import type { Request, Response } from 'express';
import { sendResponse } from '../../http/response/index.js';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from './service.js';
import z from 'zod';
import { CustomError } from '../../http/error/customError.js';
import type { PostCreateInput, PostUpdateInput } from '@reddit-clone/shared';

export async function postIndexHandler(req: Request, res: Response) {
  const posts = await getAllPosts();

  return sendResponse({
    res,
    data: posts,
    message: 'Posts retrieved successfully',
    statusCode: 200,
  });
}

export async function postRetrieveHandler(req: Request, res: Response) {
  const id = req.params.id;

  const numericId = z.number().parse(Number(id));

  const post = await getPostById(numericId);

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

  await createPost(validatedBody);

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
