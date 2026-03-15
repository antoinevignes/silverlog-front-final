import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";

export const personDetailsQuery = (personId: string) =>
  queryOptions({
    queryKey: ["person", "details", personId],
    queryFn: () =>
      apiClient<any>(`/tmdb/person/${personId}`, {
        params: { language: "fr-FR" },
      }),
  });

export const personDetailsQueryUS = (personId: string) =>
  queryOptions({
    queryKey: ["person", "detailsUS", personId],
    queryFn: () =>
      apiClient<any>(`/tmdb/person/${personId}`, {
        params: { language: "en-US" },
      }),
  });

export const personCreditsQuery = (personId: string) =>
  queryOptions({
    queryKey: ["person", "credits", personId],
    queryFn: () =>
      apiClient<any>(`/tmdb/person/${personId}/movie_credits`, {
        params: { language: "fr-FR" },
      }),
  });

export const personSearchQuery = (query: string) =>
  queryOptions({
    queryKey: ["person", "search", query],
    queryFn: () =>
      apiClient<any>("/tmdb/search/person", {
        params: {
          query,
          include_adult: "false",
          language: "fr-FR",
          page: 1,
        },
      }),
    enabled: !!query,
  });
