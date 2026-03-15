import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import type { MovieType } from "@/utils/types/movie";
import type { CastType } from "@/utils/types/cast";
import type { CrewType } from "@/utils/types/crew";
import type { UserType } from "@/utils/types/user";

export const movieDataQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "data"],
    queryFn: () => apiClient<MovieType>(`/movies/${movieId}`),
  });

export const movieDetailsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId],
    queryFn: () =>
      apiClient<MovieType>(`/tmdb/movie/${movieId}`, {
        params: { language: "fr-FR" },
      }),
  });

export const movieCreditsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "credits"],
    queryFn: () =>
      apiClient<{ id: number; cast: CastType[]; crew: CrewType[] }>(
        `/tmdb/movie/${movieId}/credits`,
        {
        params: { language: "fr-FR" },
      }),
  });

export const similarMoviesQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "similar"],
    queryFn: () =>
      apiClient<{ results: MovieType[] }>(`/tmdb/movie/${movieId}/similar`, {
        params: { language: "fr-FR" },
      }),
  });

export const movieSearchQuery = (query: string) =>
  queryOptions({
    queryKey: ["movie", "search", query],
    queryFn: () =>
      apiClient<{ results: MovieType[] }>("/tmdb/search/movie", {
        params: {
          query,
          include_adult: "false",
          language: "fr-FR",
          page: 1,
        },
      }),
    enabled: !!query,
  });

export const popularMoviesQuery = () =>
  queryOptions({
    queryKey: ["movie", "popular"],
    queryFn: () =>
      apiClient<{ results: MovieType[] }>("/tmdb/trending/movie/week", {
        params: { language: "fr-FR" },
      }),
  });

export const crewPicksQuery = () =>
  queryOptions({
    queryKey: ["movies", "crew-picks"],
    queryFn: () => apiClient<MovieType[]>("/movies/crew-picks"),
  });

export const movieFriendsActivityQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movies", movieId, "friends-activity"],
    queryFn: () => apiClient<UserType[]>(`/movies/${movieId}/friends`),
  });
