import type { Post } from '@reddit-clone/shared';

export let posts: Post[] = [];

export function replacePosts(newPosts: Post[]) {
  posts = newPosts;
}
