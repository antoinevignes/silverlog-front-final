import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { useNavigate } from "@tanstack/react-router";

// MISE A JOUR DU PSEUDO UTILISATEUR
export function useUpdateUsername() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (username: string) => {
      if (!user) throw new Error("Unauthenticated");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/username`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Profil mis à jour !");
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }
      toast.error(error.message);
    },
  });
}
// MISE A JOUR DE LA LOCALISATION UTILISATEUR
export function useUpdateLocation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (location: string) => {
      if (!user) throw new Error("Unauthenticated");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/location`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Profil mis à jour !");
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
