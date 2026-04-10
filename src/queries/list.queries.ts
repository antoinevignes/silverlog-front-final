import { queryOptions } from "@tanstack/react-query";

export const listDataQuery = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId, "data"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${listId}`,
        { credentials: "include" },
      );

      return await res.json();
    },
  });
