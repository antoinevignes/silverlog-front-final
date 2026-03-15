export type UserType = {
  id: string;
  username: string;
  email: string;
  top_list_id: string;
  watchlist_id: string;
  avatar_path: string | null;
  banner_path: string | null;
  bio?: string;
  location?: string;
  created_at?: string;
  description?: string;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
  watchlist_total?: number;
  custom_lists_total?: number;
  viewed_movies_count?: number;
  viewed_movies_this_year_count?: number;
  avg_rating?: number;
  top_movies?: Array<{
    id: number;
    movie_id: number;
    poster_path: string;
    title?: string;
  }>;
  recent_activity?: Array<{
    id: number;
    movie_id: number;
    poster_path: string;
    title?: string;
    type?: string;
    created_at?: string;
  }>;
};

export type FeedActivityType = {
  user_id: string;
  username: string;
  avatar_path: string | null;
  created_at: string;
  movie_id: string;
  poster_path: string | null;
  title: string;
  type: "rating" | "watchlist";
  rating?: number;
  review_content?: string;
};
