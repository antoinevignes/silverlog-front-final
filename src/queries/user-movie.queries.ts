import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import type { MovieType } from "@/utils/types/movie";

export const movieStateQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "state"],
    queryFn: () => apiClient<MovieType>(`/user_movie/${movieId}`),
  });

export const seenMoviesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["user", userId, "seen-movies"],
    queryFn: () => apiClient<MovieType[]>("/user_movie/seen"),
  });
