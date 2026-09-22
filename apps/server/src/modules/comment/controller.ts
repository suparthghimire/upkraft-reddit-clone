import type { Request, Response } from 'express';
import { sendResponse } from '../../http/response/index.js';
import { createNewComment, getAllCommentsForPost } from './services.js';
import z from 'zod';
import type { CreateCommentSchema } from '@reddit-clone/shared';

export async function getAllCommentsForPostHandler(req: Request, res: Response) {
  const postId = z.number().parse(Number(req.params.postId));

  const comments = await getAllCommentsForPost({ postId: postId });

  return sendResponse({
    data: comments,
    message: 'Comments fetched!',
    res,
    statusCode: 200,
  });
}

export async function createCommentHandler(req: Request, res: Response) {
  const user = res.locals.user;
  const postId = z.number().parse(Number(req.params.postId));
  const validatedBody = req.validatedBody as CreateCommentSchema;

  await createNewComment({
    postId,
    payload: validatedBody,
    userId: user.id,
  });

  return sendResponse({
    message: 'Comment created!',
    res,
    statusCode: 201,
  });
}
