import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import { reviewKeys } from "@/utils/query-keys";
import type { ReviewType } from "@/features/review/types/review";

export const movieReviewQuery = (user: unknown, movieId: string) =>
  queryOptions({
    queryKey: reviewKeys.userReview(movieId),
    queryFn: () => apiClient<ReviewType>(`/reviews/${movieId}`),
    enabled: !!user,
  });

export const movieReviewsQuery = (movieId: string) =>
  queryOptions({
    queryKey: reviewKeys.byMovie(movieId),
    queryFn: () => apiClient<ReviewType[]>(`/reviews/${movieId}/all`),
  });

export const recentReviewsQuery = () =>
  queryOptions({
    queryKey: reviewKeys.recent(),
    queryFn: () => apiClient<ReviewType[]>("/reviews/recent"),
  });
