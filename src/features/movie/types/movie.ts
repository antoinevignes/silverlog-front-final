// Données provenant de l'API TMDB
export type TMDBMovieData = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  backdrop_path: string;
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  origin_country: Array<string>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  production_companies: Array<{ name: string }>;
  tagline: string;
  popularity: number;
};

// Données internes (liées au user ou à l'app)
export type UserMovieData = {
  seen_at: string;
  rated_at: string;
  personal_rating: number;
  rating_count?: number;
  movie_avg?: number;
  rating?: number;
  added_at?: string;
  lists?: Array<{ id: number; title: string; list_type: string }>;
};

// Type complet = TMDB + données internes
export type MovieType = TMDBMovieData & UserMovieData;
