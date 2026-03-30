import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import { movieKeys } from "@/utils/query-keys";
import type { MovieType } from "@/features/movie/types/movie";
import type { CastType } from "@/features/movie/types/cast";
import type { CrewType } from "@/features/movie/types/crew";
import type { UserType } from "@/features/user/types/user";

export const movieDataQuery = (movieId: string) =>
  queryOptions({
    queryKey: movieKeys.data(movieId),
    queryFn: () => apiClient<MovieType>(`/movies/${movieId}`),
  });

export const movieDetailsQuery = (movieId: string) =>
  queryOptions({
    queryKey: movieKeys.detail(movieId),
    queryFn: () =>
      apiClient<MovieType>(`/tmdb/movie/${movieId}`, {
        params: { language: "fr-FR" },
      }),
  });

export const movieCreditsQuery = (movieId: string) =>
  queryOptions({
    queryKey: movieKeys.credits(movieId),
    queryFn: () =>
      apiClient<{ id: number; cast: CastType[]; crew: CrewType[] }>(
        `/tmdb/movie/${movieId}/credits`,
        {
        params: { language: "fr-FR" },
      }),
  });

export const similarMoviesQuery = (movieId: string) =>
  queryOptions({
    queryKey: movieKeys.similar(movieId),
    queryFn: () =>
      apiClient<{ results: MovieType[] }>(`/tmdb/movie/${movieId}/similar`, {
        params: { language: "fr-FR" },
      }),
  });

export const movieSearchQuery = (query: string) =>
  queryOptions({
    queryKey: movieKeys.search(query),
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
    queryKey: movieKeys.popular(),
    queryFn: () =>
      apiClient<{ results: MovieType[] }>("/tmdb/trending/movie/week", {
        params: { language: "fr-FR" },
      }),
  });

export const crewPicksQuery = () =>
  queryOptions({
    queryKey: movieKeys.crewPicks(),
    queryFn: () => apiClient<MovieType[]>("/movies/crew-picks"),
  });

export const movieFriendsActivityQuery = (movieId: string) =>
  queryOptions({
    queryKey: movieKeys.friendsActivity(movieId),
    queryFn: () => apiClient<UserType[]>(`/movies/${movieId}/friends`),
  });

export const topRatedMoviesQuery = (page: number = 1) =>
  queryOptions({
    queryKey: movieKeys.topRated(page),
    queryFn: () =>
      apiClient<{
        results: MovieType[];
        page: number;
        total_pages: number;
        total_results: number;
      }>("/movies/top-rated", {
        params: { page, language: "fr-FR" },
      }),
  });

export const discoverMoviesQuery = (params: Record<string, string | number>) =>
  queryOptions({
    queryKey: ["discover", "movies", params],
    queryFn: () =>
      apiClient<{
        results: MovieType[];
        page: number;
        total_pages: number;
        total_results: number;
      }>("/tmdb/discover/movie", {
        params: { ...params, language: "fr-FR" },
      }),
  });
