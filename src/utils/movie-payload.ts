export type MoviePayload = {
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  genres: Array<{ id: number; name: string }>;
};

export function sanitizeMoviePayload(payload: MoviePayload) {
  return {
    title: payload.title,
    poster_path: payload.posterPath?.trim() || null,
    backdrop_path: payload.backdropPath?.trim() || null,
    release_date: payload.releaseDate?.trim() || null,
    genres: payload.genres.length > 0 ? payload.genres : null,
  };
}
