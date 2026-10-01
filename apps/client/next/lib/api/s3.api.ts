import { ApiResponse, CreateUploadUrlInput } from '@reddit-clone/shared';
import { axiosV1 } from '../axios';

export async function handleCreateUploadUrl(args: CreateUploadUrlInput) {
  const res = await axiosV1.post<ApiResponse<{ uploadUrl: string; key: string }>>(
    '/s3/upload-url',
    args,
  );
  return res.data;
}
