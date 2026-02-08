import { queryOptions } from "@tanstack/react-query";

export const movieReviewQuery = (user: any, movieId: number) =>
  queryOptions({
    queryKey: ["review", movieId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
  });
