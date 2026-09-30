import { Router } from 'express';
import { handleGetPresignedUrl } from './controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { isValidUser } from '../user/middleware.js';
import { createPresignedUrlSchema } from '@reddit-clone/shared';

export const s3Router = Router().post(
  '/presigned-url',
  isValidUser,
  validate(createPresignedUrlSchema),
  handleGetPresignedUrl,
);
