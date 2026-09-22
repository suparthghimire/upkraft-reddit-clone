import { User } from './user.types';

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  text: string;
  parent_comment_id?: number | null;
  created_at: string;
  updated_at: string;
  user: User;
  childComments: Comment[];
};
