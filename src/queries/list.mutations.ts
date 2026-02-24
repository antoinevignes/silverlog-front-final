import { useAuth } from "@/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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
    }: {
      type: "top" | "watchlist";
      movieId: string;
    }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const listId = user?.[LIST_CONFIG[type].idKey];

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
    mutationFn: async ({ listId }: { listId: number }) => {
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
