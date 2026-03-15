import type { MovieType } from "@/features/movie/types/movie";

export type ListType = {
  id: number;
  title: string;
  description: string;
  list_type: string;
  username?: string;
  saved_count: number;
  updated_at?: string;
  is_saved?: boolean;
  movies: Array<MovieType>;
};
