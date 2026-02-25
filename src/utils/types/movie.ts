export type MovieType = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  runtime: number;
  origin_country: string[];
  spoken_languages: { iso_639_1: string; name: string }[];
  production_companies: { name: string }[];
  tagline: string;
  popularity: number;
  seen_at: string;
  personal_rating: number;
};
