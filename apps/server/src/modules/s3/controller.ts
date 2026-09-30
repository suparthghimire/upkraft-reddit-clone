import type { Request, Response } from 'express';
import { sendResponse } from '../../http/response/index.js';
import type { CreatePresignedUrlInput } from '@reddit-clone/shared';
import { createPresignedUrl } from './service.js';

export async function handleGetPresignedUrl(req: Request, res: Response) {
  const body = req.validatedBody as CreatePresignedUrlInput;

  const user = res.locals.user;

  const { key, uploadUrl } = await createPresignedUrl({
    ...body,
    userId: user.id,
  });

  return sendResponse({
    message: 'Presigned URLs generated successfully',
    data: {
      key,
      uploadUrl,
    },
    res,
    statusCode: 200,
  });
}
