import type { Request, Response } from 'express';
import { posts, replacePosts } from './service.js';
import { type PostCreateInput } from './schemas/create.schema.js';
import type { PostUpdateInput } from './schemas/update.schema.js';
import { CustomError } from '../../http/error/customError.js';
import { sendResponse } from '../../http/response/index.js';

export function postIndexHandler(req: Request, res: Response) {
  return sendResponse({
    res,
    data: posts,
    message: 'Posts retrieved successfully',
    statusCode: 200,
  });
}

export function postRetrieveHandler(req: Request, res: Response) {
  const id = req.params.id;

  // Find the post
  const post = posts.find((post) => post.id === id);

  if (!post) throw new CustomError('Post not found', 404);

  return sendResponse({
    res,
    data: post,
    message: 'Post retrieved successfully',
    statusCode: 200,
  });
}

export function postCreateHandler(req: Request, res: Response) {
  const validatedBody = req.validatedBody as PostCreateInput;
  // Generate a random id
  const randomId = (Math.floor(Math.random() * 1000) + 1).toString();
  const post = { id: randomId, ...validatedBody };
  posts.push(post);

  return sendResponse({
    res,
    data: post,
    message: 'Post created successfully',
    statusCode: 201,
  });
}

export function postUpdateHandler(req: Request, res: Response) {
  const id = req.params.id;
  const validatedBody = req.validatedBody as PostUpdateInput;

  // sometcode
  // Find post that belongs to the id
  const postIndex = posts.findIndex((post) => post.id === id);

  // TODOL Instead of throwing Error,
  // See how. can we throw 404 err
  if (postIndex === -1) throw new CustomError('Post not found', 404);

  const post = posts[postIndex]!;

  const updatedPost = { ...post, ...validatedBody } as PostCreateInput & {
    id: string;
  };

  posts[postIndex] = updatedPost;

  return sendResponse({
    res,
    data: updatedPost,
    message: 'Post updated successfully',
    statusCode: 201,
  });
}

export function postDeleteHandler(req: Request, res: Response) {
  const id = req.params.id;

  // Find the post
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) throw new CustomError('Post not found', 404);

  // Filter posts whose id is not the given id
  const newPosts = posts.filter((post) => post.id !== id);

  replacePosts(newPosts);

  return sendResponse({
    res,
    data: newPosts,
    message: 'Post deleted successfully',
    statusCode: 201,
  });
}
