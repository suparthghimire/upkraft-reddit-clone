import { Router } from 'express';
import {
  postCreateHandler,
  postDeleteHandler,
  postIndexHandler,
  postRetrieveBySlugHandler,
  postRetrieveHandler,
  postVoteHandler,
  postUpdateHandler,
  postSearchHandler,
} from './controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { postCreateSchema, postUpdateSchema } from '@reddit-clone/shared';
import { isValidUser } from '../user/middleware.js';

export const postRouter = Router()
  .get('/', postIndexHandler)
  .get('/search', postSearchHandler)
  .get('/:id', postRetrieveHandler)
  .get('/slug/:slug', postRetrieveBySlugHandler)
  .post('/', isValidUser, validate(postCreateSchema), postCreateHandler)
  .patch('/:id', isValidUser, validate(postUpdateSchema), postUpdateHandler)
  .put('/:id/vote/:voteType', isValidUser, postVoteHandler)
  .delete('/:id', isValidUser, postDeleteHandler);
