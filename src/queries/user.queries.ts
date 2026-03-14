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

export const userFollowersQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["followers", user_id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user_id}/followers`,
      );
      if (!res.ok) throw new Error("Erreur de récupération des abonnés");
      const data = await res.json();
      return data;
    },
  });

export const userFollowingQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["following", user_id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user_id}/following`,
      );
      if (!res.ok) throw new Error("Erreur de récupération des abonnements");
      const data = await res.json();
      return data;
    },
  });

export const userFeedQuery = () =>
  queryOptions({
    queryKey: ["user", "feed"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/feed`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur de récupération du flux d'activité");
      const data = await res.json();
      return data;
    },
  });
