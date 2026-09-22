export const queryKeys = {
  getUser: () => ['getUser'],
  getComments: (postId: number) => ['comments', postId],
};
