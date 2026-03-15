import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";

export const movieReviewQuery = (user: unknown, movieId: string) =>
  queryOptions({
    queryKey: ["review", movieId],
    queryFn: () => apiClient<any>(`/reviews/${movieId}`),
    enabled: !!user,
  });

export const movieReviewsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["reviews", movieId],
    queryFn: () => apiClient<any[]>(`/reviews/${movieId}/all`),
  });

export const recentReviewsQuery = () =>
  queryOptions({
    queryKey: ["reviews", "recent"],
    queryFn: () => apiClient<any[]>("/reviews/recent"),
  });
