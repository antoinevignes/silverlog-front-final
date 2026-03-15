import type { UserType } from "./user";

export type ReviewType = {
  id: string;
  user_id: string;
  movie_id: string;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
  likes_count: number;
  user?: UserType;
  username?: string;
  avatar_path?: string;
};
