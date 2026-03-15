import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import type { ListType } from "@/features/list/types/list";

// DETAILS D'UNE LISTE
export const listDataQuery = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId, "data"],
    queryFn: () => apiClient<ListType>(`/lists/${listId}`),
  });

// LISTES CUSTOM UTILISATEUR
export const customListsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["custom-lists", userId],
    queryFn: async () => {
      const data = await apiClient<ListType[]>("/lists");
      return data.filter(
        (list: { list_type: string }) => list.list_type === "custom",
      );
    },
    enabled: !!userId,
  });

// LISTES PUBLIQUES
export const publicListsQuery = () =>
  queryOptions({
    queryKey: ["public-lists"],
    queryFn: () => apiClient<ListType[]>("/lists/public"),
  });

// LISTES PERSO
export const personalListsQuery = (userId: string, isPublic: boolean) =>
  queryOptions({
    queryKey: ["personal-lists", userId],
    queryFn: () =>
      apiClient<ListType[]>(`/lists/user/${userId}`, {
        params: { is_public: isPublic },
      }),
  });
