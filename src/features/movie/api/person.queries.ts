import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import { personKeys } from "@/utils/query-keys";
import type { PersonType } from "@/features/movie/types/person";

export const personDetailsQuery = (personId: string) =>
  queryOptions({
    queryKey: personKeys.details(personId),
    queryFn: () =>
      apiClient<PersonType>(`/tmdb/person/${personId}`, {
        params: { language: "fr-FR" },
      }),
  });

export const personDetailsQueryUS = (personId: string) =>
  queryOptions({
    queryKey: personKeys.detailsUS(personId),
    queryFn: () =>
      apiClient<PersonType>(`/tmdb/person/${personId}`, {
        params: { language: "en-US" },
      }),
  });

export const personCreditsQuery = (personId: string) =>
  queryOptions({
    queryKey: personKeys.credits(personId),
    queryFn: () =>
      apiClient<{ id: number; cast: any[]; crew: any[] }>(
        `/tmdb/person/${personId}/movie_credits`,
        {
        params: { language: "fr-FR" },
      }),
  });

export const personSearchQuery = (query: string) =>
  queryOptions({
    queryKey: personKeys.search(query),
    queryFn: () =>
      apiClient<{ results: PersonType[] }>("/tmdb/search/person", {
        params: {
          query,
          include_adult: "false",
          language: "fr-FR",
          page: 1,
        },
      }),
    enabled: !!query,
  });
