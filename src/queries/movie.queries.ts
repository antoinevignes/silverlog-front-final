import { queryOptions } from "@tanstack/react-query";

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
