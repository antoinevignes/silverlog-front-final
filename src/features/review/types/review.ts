import type { UserType } from "@/features/user/types/user";

export type ReviewType = {
  id: string;
  user_id: string;
  movie_id: string;
  content: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
  like_count: number;
  user?: UserType;
  username?: string;
  avatar_path?: string | null;
  movie_title?: string;
  movie_poster_path?: string | null;
};
