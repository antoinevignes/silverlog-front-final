import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import { apiClient } from "@/utils/api-client";
import { handleMutationError } from "@/utils/handle-mutation-error";
import type { ReviewType } from "@/features/review/types/review";

export function useUpsertReview(movieId: string) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<ReviewType>("/reviews", {
        method: "POST",
        body: JSON.stringify({
          movie_id: movieId,
          content,
        }),
      });
    },

    onSuccess: () => {
      toast.success("Critique ajoutée !");
      queryClient.invalidateQueries({
        queryKey: ["review", movieId],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}

export function useLikeReview(movie_id: string) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/reviews/${reviewId}/like`, {
        method: "POST",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", movie_id],
      });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}

export function useDeleteReview(reviewId: string, movieId: string) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/reviews/${reviewId}`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      toast.success("Critique supprimée !");
      queryClient.invalidateQueries({
        queryKey: ["review", movieId],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}
