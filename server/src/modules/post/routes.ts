import { Router } from 'express';
import {
  postCreateHandler,
  postDeleteHandler,
  postIndexHandler,
  postUpdateHandler,
  postRetrieveHandler,
} from './controller.js';
import { postCreateSchema } from './schemas/create.schema.js';
import { validate } from '../../middleware/validation.middleware.js';
import { postUpdateSchema } from './schemas/update.schema.js';

export const postRouter = Router()
  .get('/', postIndexHandler)
  .get('/:id', postRetrieveHandler)
  .post('/', validate(postCreateSchema), postCreateHandler)
  .patch('/:id', validate(postUpdateSchema), postUpdateHandler)
  .delete('/:id', postDeleteHandler);
