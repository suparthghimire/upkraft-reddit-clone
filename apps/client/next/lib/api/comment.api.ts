import { ApiResponse, CreateCommentSchema } from '@reddit-clone/shared';
import { axiosV1 } from '../axios';
import { Comment } from '../types/comment.types';

export async function getCommentsForPost(postId: number) {
  const res = await axiosV1.get<ApiResponse<Comment[]>>(`/comment/${postId}`);
  return res.data;
}

export async function createComment(props: { payload: CreateCommentSchema; postId: number }) {
  const res = await axiosV1.post<ApiResponse<Comment>>(`/comment/${props.postId}`, props.payload);
  return res.data;
}
