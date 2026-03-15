import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";

// DETAILS D'UNE LISTE
export const listDataQuery = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId, "data"],
    queryFn: () => apiClient<any>(`/lists/${listId}`),
  });

// LISTES CUSTOM UTILISATEUR
export const customListsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["custom-lists", userId],
    queryFn: async () => {
      const data = await apiClient<any[]>("/lists");
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
    queryFn: () => apiClient<any[]>("/lists/public"),
  });

// LISTES PERSO
export const personalListsQuery = (userId: string, isPublic: boolean) =>
  queryOptions({
    queryKey: ["personal-lists", userId],
    queryFn: () =>
      apiClient<any[]>(`/lists/user/${userId}`, {
        params: { is_public: isPublic },
      }),
  });
