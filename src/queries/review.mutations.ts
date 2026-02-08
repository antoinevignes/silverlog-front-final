import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { useNavigate } from "@tanstack/react-router";

export function useUpsertReview(movieId: number) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      return await res.json();
    },

    onSuccess: () => {
      toast.success("Critique ajoutée !");
      queryClient.invalidateQueries({
        queryKey: ["review", movieId],
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
