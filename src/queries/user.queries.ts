import { queryOptions } from "@tanstack/react-query";

export const userQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["user", user_id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user_id}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      return data;
    },
  });
