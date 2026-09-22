import { Router } from 'express';

import { getAllCommentsForPostHandler, createCommentHandler } from './controller.js';
import { isValidUser } from '../user/middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { createCommentSchema } from '@reddit-clone/shared';

export const commentRouter = Router()
  .get('/:postId', getAllCommentsForPostHandler)
  .post('/:postId', isValidUser, validate(createCommentSchema), createCommentHandler);
