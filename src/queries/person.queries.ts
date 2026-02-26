import { queryOptions } from "@tanstack/react-query";

export const personDetailsQuery = (personId: string) =>
  queryOptions({
    queryKey: ["person", "details", personId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/person/${personId}?language=fr-FR`,
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer la fiche personne.",
        );

      return await res.json();
    },
  });

export const personDetailsQueryUS = (personId: string) =>
  queryOptions({
    queryKey: ["person", "detailsUS", personId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/person/${personId}?language=en-US`,
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer la fiche personne (US).",
        );

      return await res.json();
    },
  });

export const personCreditsQuery = (personId: string) =>
  queryOptions({
    queryKey: ["person", "credits", personId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/person/${personId}/movie_credits?language=fr-FR`,
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : impossible de récupérer les crédits de la personne.",
        );

      return await res.json();
    },
  });

export const personSearchQuery = (query: string) =>
  queryOptions({
    queryKey: ["person", "search", query],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/search/person?query=${query}&include_adult=false&language=fr-FR&page=1`,
      );

      if (!res.ok)
        throw new Error(
          "Erreur réseau : erreur lors de la recherche de personne.",
        );

      return await res.json();
    },
    enabled: !!query,
  });
