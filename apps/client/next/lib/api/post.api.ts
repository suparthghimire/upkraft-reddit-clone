import { ApiResponse, PostCreateInput, PostVoteInput } from '@reddit-clone/shared';
import { axiosV1 } from '../axios';
import { Post } from '../types/post.types';

export type PostVoteResponse = {
  voteType: 'upvote' | 'downvote' | null;
  totalUpvotes: number;
  totalDownvotes: number;
};

export async function createNewPost(data: PostCreateInput) {
  const res = await axiosV1.post<ApiResponse>('/post', data);
  return res.data;
}

export async function getAllPosts(page=1,limit=10,title?:string) {
  const res = await axiosV1.get<ApiResponse<Post[]>>('/post', {
    params: {
      page,
      limit,
      title,
    },
  });
  return res.data;
}

export async function getPostBySlug(slug: string) {
  const res = await axiosV1.get<ApiResponse<Post>>(`/post/slug/${slug}`);
  return res.data;
}

export async function voteOnPost(args: { postId: number } & PostVoteInput) {
  const res = await axiosV1.put<ApiResponse<PostVoteResponse>>(
    `/post/${args.postId}/vote/${args.voteType}`,
  );
  return res.data;
}
