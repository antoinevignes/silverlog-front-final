import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/auth";

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
      movieId,
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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${listId}/movies/toggle`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movie_id: movieId,
            title,
            poster_path: posterPath?.trim() === "" ? null : posterPath,
            backdrop_path: backdropPath?.trim() === "" ? null : backdropPath,
            release_date: releaseDate?.trim() === "" ? null : releaseDate,
            genres: genres.length > 0 ? genres : null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      const data = await res.json();
      return { data, type };
    },

    onSuccess: ({ data, type }) => {
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
    mutationFn: async ({
      listId,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      genres,
    }: {
      listId: number;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${listId}/movies/toggle`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movie_id: movieId,
            title,
            poster_path: posterPath?.trim() === "" ? null : posterPath,
            backdrop_path: backdropPath?.trim() === "" ? null : backdropPath,
            release_date: releaseDate?.trim() === "" ? null : releaseDate,
            genres: genres.length > 0 ? genres : null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      const data = await res.json();
      return data;
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
    mutationFn: async ({
      title,
      description,
      is_public,
    }: {
      title: string;
      description: string;
      is_public: boolean;
    }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, is_public }),
      });

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      const data = await res.json();
      return data;
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
    mutationFn: async () => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${listId}/toggle`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      const data = await res.json();
      return data;
    },

    onSuccess: (data) => {
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
