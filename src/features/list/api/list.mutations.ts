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
import { movieKeys, listKeys } from "@/utils/query-keys";
import type { ListType } from "@/features/list/types/list";

const LIST_CONFIG: Record<
  "top" | "watchlist",
  {
    idKey: "top_list_id" | "watchlist_id";
    label: string;
    fullMessage?: string;
  }
> = {
  top: {
    idKey: "top_list_id",
    label: "top",
    fullMessage: "Le top est plein !",
  },
  watchlist: {
    idKey: "watchlist_id",
    label: "watchlist",
  },
};

// AJOUTER A UNE LISTE
export function useToggleMovieList(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (
      payload: MoviePayload & {
        type: "top" | "watchlist";
        movieId: string;
      },
    ) => {
      if (!user) throw new Error("Unauthenticated");

      const listId = user[LIST_CONFIG[payload.type].idKey];

      const data = await apiClient<{ action: string }>(
        `/lists/${listId}/movies/toggle`,
        {
          method: "POST",
          body: JSON.stringify({
            movie_id: payload.movieId,
            ...sanitizeMoviePayload(payload),
          }),
        },
      );

      return { data, type: payload.type };
    },

    onSuccess: ({ data, type }: { data: { action: string }; type: string }) => {
      if (data.action === "full" && type === "top") {
        toast.error(LIST_CONFIG.top.fullMessage);
      }

      queryClient.invalidateQueries({ queryKey: movieKeys.state(movieId) });
    },

    onError: (error) => handleMutationError(error, navigate),
  });
}

// AJOUTER A UNE LISTE PERSONNALISEE
export function useToggleCustomList(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: MoviePayload & { listId: number }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(
        `/lists/${payload.listId}/movies/toggle`,
        {
          method: "POST",
          body: JSON.stringify({
            movie_id: movieId,
            ...sanitizeMoviePayload(payload),
          }),
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.state(movieId) });
      queryClient.invalidateQueries({ queryKey: listKeys.custom(user?.id ?? "") });
    },

    onError: (error) =>
      handleMutationError(error, navigate, "Une erreur est survenue lors de l'ajout à la liste"),
  });
}

// CREER UNE LISTE PERSONNALISEE
export const useCreateList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      is_public: boolean;
    }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<ListType>("/lists", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.custom(user?.id ?? "") });
      toast.success("Liste créée avec succès");
    },

    onError: (error) =>
      handleMutationError(error, navigate, "Une erreur est survenue lors de la création de la liste"),
  });
};

// SAUVEGARDER UNE LISTE
export const useSaveList = (listId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ action: string }>(`/lists/${listId}/toggle`, {
        method: "POST",
      });
    },

    onSuccess: (data: { action: string }) => {
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });

      if (data.action === "un-saved") {
        toast.success("Liste retirée avec succès");
      } else {
        toast.success("Liste sauvegardée avec succès");
      }
    },

    onError: (error) =>
      handleMutationError(error, navigate, "Une erreur est survenue lors de la sauvegarde de la liste"),
  });
};

// SUPPRIMER UNE LISTE PERSONNALISEE
export const useDeleteList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (listId: number) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/lists/${listId}`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.custom(user?.id ?? "") });
      queryClient.invalidateQueries({ queryKey: listKeys.personal(user?.id?.toString() ?? "") });
      toast.success("Liste supprimée avec succès");
    },

    onError: (error) =>
      handleMutationError(error, navigate, "Une erreur est survenue lors de la suppression de la liste"),
  });
};

// METTRE A JOUR UNE LISTE
export const useUpdateList = (listId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      is_public: boolean;
    }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<ListType>(`/lists/${listId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.custom(user?.id ?? "") });
      toast.success("Liste mise à jour avec succès");
    },

    onError: (error) =>
      handleMutationError(error, navigate, "Une erreur est survenue lors de la mise à jour"),
  });
};

// SUPPRIMER UN FILM D'UNE LISTE
export const useRemoveMovieFromList = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: number) => {
      return apiClient<{ success: string }>(
        `/lists/${listId}/movies/${movieId}`,
        {
          method: "DELETE",
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      toast.success("Film retiré de la liste");
    },

    onError: () => {
      toast.error("Impossible de retirer le film");
    },
  });
};
