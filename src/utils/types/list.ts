export type ListType = {
  id: number;
  title: string;
  description: string;
  list_type: string;
  username?: string;
  saved_count: number;
  movies: Array<{
    id: number;
    movie_id: number;
    poster_path: string;
    added_at: string;
  }>;
};
