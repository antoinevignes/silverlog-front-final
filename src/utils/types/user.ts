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
