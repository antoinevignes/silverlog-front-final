import { queryOptions } from "@tanstack/react-query";

export const movieStateQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["movie", movieId, "state"],
    queryFn: async () => {
      const data = await fetch(
        `${import.meta.env.VITE_API_URL}/user_movie/${movieId}`,
        {
          credentials: "include",
        },
      );

      return await data.json();
    },
  });
