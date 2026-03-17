import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { seenMoviesQuery } from "./user-movie.queries";
import { useAuth } from "@/auth";
import { apiClient } from "@/utils/api-client";

export function useUpdateMovieRating(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: {
      value: number;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user_movie/${movieId}/rate`, {
        method: "POST",
        body: JSON.stringify({
          rating: payload.value * 2,
          title: payload.title,
          poster_path: payload.posterPath?.trim() === "" ? null : payload.posterPath,
          backdrop_path: payload.backdropPath?.trim() === "" ? null : payload.backdropPath,
          release_date: payload.releaseDate?.trim() === "" ? null : payload.releaseDate,
          genres: payload.genres.length > 0 ? payload.genres : null,
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
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
      queryClient.invalidateQueries({
        queryKey: seenMoviesQuery(String(user?.id)).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "details"],
      });
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }

      toast.error("Une erreur est survenue");
    },
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

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }
      toast.error("Une erreur est survenue");
    },
  });
}

export function useUpdateSeenDate(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: {
      seenDate: Date;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user_movie/${movieId}/seen-date`, {
        method: "POST",
        body: JSON.stringify({
          date: payload.seenDate,
          title: payload.title,
          poster_path: payload.posterPath?.trim() === "" ? null : payload.posterPath,
          backdrop_path: payload.backdropPath?.trim() === "" ? null : payload.backdropPath,
          release_date: payload.releaseDate?.trim() === "" ? null : payload.releaseDate,
          genres: payload.genres.length > 0 ? payload.genres : null,
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

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }
      toast.error("Une erreur est survenue");
    },
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

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }
      toast.error("Une erreur est survenue");
    },
  });
}
