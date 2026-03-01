import { queryOptions } from "@tanstack/react-query";

// DETAILS D'UNE LISTE
export const listDataQuery = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId, "data"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${listId}`,
        { credentials: "include" },
      );

      if (!res.ok)
        throw new Error("Erreur réseau : impossible de récupérer cette liste.");

      return await res.json();
    },
  });

// LISTES CUSTOM UTILISATEUR
export const customListsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["custom-lists", userId],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
        credentials: "include",
      });
      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer vos listes custom.",
        );
      const data = await res.json();

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
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/public`, {
        credentials: "include",
      });

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer les listes publiques.",
        );

      const data = await res.json();

      return data;
    },
  });

// LISTES PERSO
export const personalListsQuery = (userId: string, isPublic: boolean) =>
  queryOptions({
    queryKey: ["personal-lists", userId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/user/${userId}?is_public=${isPublic}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer les listes personnelles.",
        );

      const data = await res.json();

      return data;
    },
  });
