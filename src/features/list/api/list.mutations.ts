import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { apiClient } from "@/utils/api-client";
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
    mutationFn: async ({
      type,
      movieId: payloadMovieId,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      genres,
    }: {
      type: "top" | "watchlist";
      movieId: string;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const listId = user[LIST_CONFIG[type].idKey];

      const data = await apiClient<{ action: string }>(
        `/lists/${listId}/movies/toggle`,
        {
          method: "POST",
          body: JSON.stringify({
            movie_id: payloadMovieId,
            title,
            poster_path: posterPath?.trim() === "" ? null : posterPath,
            backdrop_path: backdropPath?.trim() === "" ? null : backdropPath,
            release_date: releaseDate?.trim() === "" ? null : releaseDate,
            genres: genres.length > 0 ? genres : null,
          }),
        },
      );

      return { data, type };
    },

    onSuccess: ({ data, type }: { data: { action: string }; type: string }) => {
      if (data.action === "full" && type === "top") {
        toast.error(LIST_CONFIG.top.fullMessage);
      }

      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
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

// AJOUTER A UNE LISTE PERSONNALISEE
export function useToggleCustomList(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: {
      listId: number;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/lists/${payload.listId}/movies/toggle`, {
        method: "POST",
        body: JSON.stringify({
          movie_id: movieId,
          title: payload.title,
          poster_path: payload.posterPath?.trim() === "" ? null : payload.posterPath,
          backdrop_path: payload.backdropPath?.trim() === "" ? null : payload.backdropPath,
          release_date: payload.releaseDate?.trim() === "" ? null : payload.releaseDate,
          genres: payload.genres.length > 0 ? payload.genres : null,
        }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({
        queryKey: ["custom-lists", user?.id],
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

      toast.error("Une erreur est survenue lors de l'ajout à la liste");
    },
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
      queryClient.invalidateQueries({
        queryKey: ["custom-lists", user?.id],
      });
      toast.success("Liste créée avec succès");
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }

      toast.error("Une erreur est survenue lors de la création de la liste");
    },
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
      queryClient.invalidateQueries({
        queryKey: ["list", listId, "data"],
      });

      if (data.action === "un-saved") {
        toast.success("Liste retirée avec succès");
      } else {
        toast.success("Liste sauvegardée avec succès");
      }
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }

      toast.error("Une erreur est survenue lors de la sauvegarde de la liste");
    },
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
      queryClient.invalidateQueries({
        queryKey: ["custom-lists", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["personal-lists", user?.id?.toString()],
      });
      toast.success("Liste supprimée avec succès");
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }

      toast.error("Une erreur est survenue lors de la suppression de la liste");
    },
  });
};
