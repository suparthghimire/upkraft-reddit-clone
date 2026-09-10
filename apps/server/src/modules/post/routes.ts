import { Router } from 'express';
import {
  postCreateHandler,
  postDeleteHandler,
  postIndexHandler,
  postUpdateHandler,
  postRetrieveHandler,
} from './controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { postCreateSchema, postUpdateSchema } from '@reddit-clone/shared';

export const postRouter = Router()
  .get('/', postIndexHandler)
  .get('/:id', postRetrieveHandler)
  .post('/', validate(postCreateSchema), postCreateHandler)
  .patch('/:id', validate(postUpdateSchema), postUpdateHandler)
  .delete('/:id', postDeleteHandler);
