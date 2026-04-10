import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import { movieKeys, userKeys } from "@/utils/query-keys";
import type { MovieType } from "@/features/movie/types/movie";

export const movieStateQuery = (movieId: string) =>
  queryOptions({
    queryKey: movieKeys.state(movieId),
    queryFn: () => apiClient<MovieType>(`/user_movie/${movieId}`),
  });

export const seenMoviesQuery = (userId: string) =>
  queryOptions({
    queryKey: userKeys.seenMovies(userId),
    queryFn: () => apiClient<MovieType[]>("/user_movie/seen"),
  });
