import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { useNavigate } from "@tanstack/react-router";
import { apiClient } from "@/utils/api-client";
import type { UserType } from "@/utils/types/user";

// MISE A JOUR DU PSEUDO UTILISATEUR
export function useUpdateUsername() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (username: string) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<UserType>("/user/username", {
        method: "PATCH",
        body: JSON.stringify({ username }),
      });
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
    mutationFn: (location: string) => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<UserType>("/user/location", {
        method: "PATCH",
        body: JSON.stringify({ location }),
      });
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
    mutationFn: (file: File) => {
      if (!user) throw new Error("Unauthenticated");

      const formData = new FormData();
      formData.append("avatar", file);

      return apiClient<UserType>("/user/avatar", {
        method: "PATCH",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });
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

// MISE A JOUR DU BANNER UTILISATEUR (upload fichier)
export function useUploadBanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      if (!user) throw new Error("Unauthenticated");

      const formData = new FormData();
      formData.append("banner", file);

      return apiClient<UserType>("/user/banner", {
        method: "PATCH",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Bannière mise à jour !");
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible d'uploader la bannière");
    },
  });
}

// SUPPRESSION DE COMPTE UTILISATEUR
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () =>
      apiClient<{ success: string }>("/user/delete", {
        method: "DELETE",
      }),

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

// SUPPRESSION DE L'AVATAR UTILISATEUR
export function useDeleteAvatar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<UserType>("/user/avatar", {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Avatar supprimé avec succès !");
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible de supprimer l'avatar");
    },
  });
}

// SUPPRESSION DU BANNER UTILISATEUR
export function useDeleteBanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<UserType>("/user/banner", {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Bannière supprimée avec succès !");
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible de supprimer la bannière");
    },
  });
}

// SUIVRE UN UTILISATEUR
export function useFollowUser(userId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user/${userId}/follow`, {
        method: "POST",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] });
      toast.success("Vous suivez maintenant cet utilisateur");
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible de suivre cet utilisateur");
    },
  });
}

// NE PLUS SUIVRE UN UTILISATEUR
export function useUnfollowUser(userId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Unauthenticated");

      return apiClient<{ success: string }>(`/user/${userId}/follow`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] });
      toast.success("Vous ne suivez plus cet utilisateur");
    },

    onError: (error) => {
      toast.error(error.message ?? "Impossible d'arrêter de suivre cet utilisateur");
    },
  });
}
