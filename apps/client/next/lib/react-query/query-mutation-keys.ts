import { QueryParamSchema } from '@reddit-clone/shared';

export const queryKeys = {
  getPosts: (queryParams?: QueryParamSchema) => ['posts', queryParams],
  getUser: () => ['getUser'],
  getComments: (postId: number) => ['comments', postId],
};
