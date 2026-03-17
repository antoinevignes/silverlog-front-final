import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { apiClient } from "@/utils/api-client";
import { handleMutationError } from "@/utils/handle-mutation-error";
import {
  sanitizeMoviePayload,
  type MoviePayload,
} from "@/utils/movie-payload";
import { movieKeys, reviewKeys, userKeys } from "@/utils/query-keys";

export function useUpdateMovieRating(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: MoviePayload & { value: number }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user_movie/${movieId}/rate`, {
        method: "POST",
        body: JSON.stringify({
          rating: payload.value * 2,
          ...sanitizeMoviePayload(payload),
        }),
      });
    },
    onSuccess: () => {
      toast.success("Note mise à jour !");
      queryClient.invalidateQueries({ queryKey: movieKeys.state(movieId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.byMovie(movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.data(movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.detail(movieId) });
      queryClient.invalidateQueries({ queryKey: userKeys.seenMovies(String(user?.id)) });
      queryClient.invalidateQueries({ queryKey: movieKeys.details(movieId) });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}

export function useDeleteMovieRating(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user_movie/${movieId}`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      toast.success("Note supprimée !");
      queryClient.invalidateQueries({ queryKey: movieKeys.state(movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.data(movieId) });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}

export function useUpdateSeenDate(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: MoviePayload & { seenDate: Date }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user_movie/${movieId}/seen-date`, {
        method: "POST",
        body: JSON.stringify({
          date: payload.seenDate,
          ...sanitizeMoviePayload(payload),
        }),
      });
    },

    onSuccess: () => {
      toast.success("Film ajouté au journal !");
      queryClient.invalidateQueries({ queryKey: movieKeys.state(movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.data(movieId) });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}

export function useRemoveFromDiary(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: boolean }>(`/user_movie/${movieId}/diary`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      toast.success("Film retiré du journal !");
      queryClient.invalidateQueries({ queryKey: movieKeys.state(movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.data(movieId) });
      queryClient.invalidateQueries({ queryKey: userKeys.seenMovies(String(user?.id)) });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}
