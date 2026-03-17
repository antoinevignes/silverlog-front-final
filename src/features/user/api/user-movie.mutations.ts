import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { seenMoviesQuery } from "./user-movie.queries";
import { useAuth } from "@/auth";
import { apiClient } from "@/utils/api-client";
import { handleMutationError } from "@/utils/handle-mutation-error";
import {
  sanitizeMoviePayload,
  type MoviePayload,
} from "@/utils/movie-payload";

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
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
      queryClient.invalidateQueries({
        queryKey: seenMoviesQuery(String(user?.id)).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "details"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
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
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
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
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
      queryClient.invalidateQueries({
        queryKey: seenMoviesQuery(String(user?.id)).queryKey,
      });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}
