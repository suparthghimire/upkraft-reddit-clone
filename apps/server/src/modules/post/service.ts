import type { PostCreateInput } from './schemas/create.schema.js';

export let posts: (PostCreateInput & {
  id: string;
})[] = [];

export function replacePosts(newPosts: (PostCreateInput & { id: string })[]) {
  posts = newPosts;
}
