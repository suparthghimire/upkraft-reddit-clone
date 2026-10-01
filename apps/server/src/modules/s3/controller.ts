import type { Request, Response } from 'express';
import { sendResponse } from '../../http/response/index.js';
import type { CreatePresignedUrlInput, CreateUploadUrlInput } from '@reddit-clone/shared';
import { getPresignedUrlFromKey, getUploadUrl } from './service.js';

export async function handleGetUploadUrl(req: Request, res: Response) {
  // Implement logic to generate and return a presigned URL for S3
  const user = res.locals.user;
  const body = req.validatedBody as CreateUploadUrlInput;

  const { key, uploadUrl } = await getUploadUrl({ ...body, userId: user.id });

  return sendResponse({
    message: 'URLs generated',
    data: { key, uploadUrl },
    res,
    statusCode: 200,
  });
}

export async function handleGetPresignedUrl(req: Request, res: Response) {
  const body = req.validatedBody as CreatePresignedUrlInput;

  const presignedUrl = await getPresignedUrlFromKey(body.key);

  return sendResponse({
    message: 'Presigned URL generated',
    data: { presignedUrl },
    res,
    statusCode: 200,
  });
}
