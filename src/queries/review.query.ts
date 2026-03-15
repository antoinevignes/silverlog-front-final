import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import type { ReviewType } from "@/utils/types/review";

export const movieReviewQuery = (user: unknown, movieId: string) =>
  queryOptions({
    queryKey: ["review", movieId],
    queryFn: () => apiClient<ReviewType>(`/reviews/${movieId}`),
    enabled: !!user,
  });

export const movieReviewsQuery = (movieId: string) =>
  queryOptions({
    queryKey: ["reviews", movieId],
    queryFn: () => apiClient<ReviewType[]>(`/reviews/${movieId}/all`),
  });

export const recentReviewsQuery = () =>
  queryOptions({
    queryKey: ["reviews", "recent"],
    queryFn: () => apiClient<ReviewType[]>("/reviews/recent"),
  });
