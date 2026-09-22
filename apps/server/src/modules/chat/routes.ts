import { Router } from 'express';
import { chatRequestSchema } from '@reddit-clone/shared';
import { validate } from '../../middleware/validation.middleware.js';
import { chatStreamHandler, chatTextHandler } from './controller.js';
import { isValidUser } from '../user/middleware.js';

export const chatRouter = Router()
  .post('/stream', isValidUser, validate(chatRequestSchema), chatStreamHandler)
  .post('/text', isValidUser, validate(chatRequestSchema), chatTextHandler);
