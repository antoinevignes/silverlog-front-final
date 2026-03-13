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
      toast.success("Localisation mise à jour !");
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

// MISE A JOUR DE L'AVATAR UTILISATEUR (upload fichier)
export function useUploadAvatar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("Unauthenticated");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/avatar`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "Une erreur est survenue");
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Avatar mis à jour !");
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible d'uploader l'avatar");
    },
  });
}

// SUPPRESSION DE COMPTE UTILISATEUR
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "Une erreur est survenue");
      }

      return data;
    },

    onSuccess: () => {
      queryClient.setQueryData(["session"], {
        user: null,
        isAuthenticated: false,
      });
      queryClient.clear();
      toast.success("Votre compte a été supprimé avec succès.");
      navigate({ to: "/" });
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible de supprimer le compte");
    },
  });
}
