import { Router } from 'express';
import { isValidUser } from '../user/middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { createPresignedUrlSchema, createUploadUrlSchema } from '@reddit-clone/shared';
import { handleGetPresignedUrl, handleGetUploadUrl } from './controller.js';

export const s3Router = Router()
  .post('/upload-url', isValidUser, validate(createUploadUrlSchema), handleGetUploadUrl)
  .post('/presigned-url', isValidUser, validate(createPresignedUrlSchema), handleGetPresignedUrl);
