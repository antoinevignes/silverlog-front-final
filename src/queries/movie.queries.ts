import { queryOptions } from "@tanstack/react-query";

export const movieStateQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "state"],
    queryFn: async () => {
      const data = await fetch(
        `${import.meta.env.VITE_API_URL}/user_movies/${movieId}`,
        {
          credentials: "include",
        },
      );

      return await data.json();
    },
  });

export const movieDataQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "data"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/${movieId}`,
      );

      return await res.json();
    },
  });

export const movieDetailsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/movie/${movieId}?language=fr-FR`,
      );

      return await res.json();
    },
  });

export const movieCreditsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "credits"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/movie/${movieId}/credits?language=fr-FR`,
      );

      return await res.json();
    },
  });

export const similarMoviesQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "similar"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/movie/${movieId}/similar?language=fr-FR`,
      );

      return await res.json();
    },
  });

export const movieSearchQuery = (query: string) =>
  queryOptions({
    queryKey: ["movie", "search", query],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/search/movie?query=${query}&include_adult=false&language=fr-FR&page=1`,
      );

      return await res.json();
    },
    enabled: !!query,
  });
