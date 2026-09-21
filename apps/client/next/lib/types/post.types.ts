import type { User } from './user.types';

export type Vote = {
  id: number;
  post_id: number;
  user_id: number;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
  updated_at: string | null;
};

export type Post = {
  id: number;
  content: string;
  title: string;
  created_at: string;
  slug: string;
  updated_at: string;
  user: User;
  total_upvotes: number;
  total_downvotes: number;
  votes: Vote[];
};
