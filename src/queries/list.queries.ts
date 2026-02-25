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

export const customListsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["custom-lists", userId],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
        credentials: "include",
      });
      const data = await res.json();

      return data.filter(
        (list: { list_type: string }) => list.list_type === "custom",
      );
    },
    enabled: !!userId,
  });

export const publicListsQuery = () =>
  queryOptions({
    queryKey: ["public-lists"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/public`, {
        credentials: "include",
      });
      const data = await res.json();

      return data;
    },
  });
