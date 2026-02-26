import { queryOptions } from "@tanstack/react-query";

export const movieReviewQuery = (user: unknown, movieId: string) =>
  queryOptions({
    queryKey: ["review", movieId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${movieId}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok)
        throw new Error("Erreur réseau : impossible de récupérer l'avis.");

      const data = await res.json();

      return data;
    },
    enabled: !!user,
  });

export const movieReviewsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["reviews", movieId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${movieId}/all`,
        {
          credentials: "include",
        },
      );

      if (!res.ok)
        throw new Error("Erreur réseau : impossible de récupérer les avis.");

      const data = await res.json();

      return data;
    },
  });
