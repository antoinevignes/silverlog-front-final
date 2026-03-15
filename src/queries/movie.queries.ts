import { queryOptions } from "@tanstack/react-query";

export const movieDataQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "data"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/${movieId}`,
      );

      if (!res.ok)
        throw new Error("Erreur réseau : impossible de récupérer le film.");

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

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer les détails du film.",
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

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer le casting du film.",
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

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer les films similaires.",
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

      if (!res.ok)
        throw new Error(
          "Erreur réseau : erreur lors de la recherche de films.",
        );

      return await res.json();
    },
    enabled: !!query,
  });

export const popularMoviesQuery = () =>
  queryOptions({
    queryKey: ["movie", "popular"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/trending/movie/week?language=fr-FR`,
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer les films populaires.",
        );

      return await res.json();
    },
  });

export const crewPicksQuery = () =>
  queryOptions({
    queryKey: ["movies", "crew-picks"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/crew-picks`,
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer la sélection de la rédaction.",
        );

      return await res.json();
    },
  });

export const movieFriendsActivityQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movies", movieId, "friends-activity"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/${movieId}/friends`,
        {
          credentials: "include",
        },
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer l'activité des amis.",
        );

      return await res.json();
    },
  });
