import { queryOptions } from "@tanstack/react-query";

export const movieReviewQuery = (user: any, movieId: number) =>
  queryOptions({
    queryKey: ["review", movieId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${movieId}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      return data;
    },
    enabled: !!user,
    retry: false,
  });

export const movieReviewsQuery = (movieId: number) =>
  queryOptions({
    queryKey: ["reviews", movieId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${movieId}/all`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      return data;
    },
  });
