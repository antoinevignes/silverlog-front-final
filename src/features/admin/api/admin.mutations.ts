import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { adminKeys } from "./admin.queries";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "user" | "admin" }) => {
      return await apiClient(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
    },
    onSuccess: () => {
      toast.success("Le rôle de l'utilisateur a été mis à jour.");
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la modification du rôle.");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await apiClient(`/admin/users/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Utilisateur supprimé définitivement.");
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression.");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      return await apiClient(`/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Critique supprimée.");
      queryClient.invalidateQueries({ queryKey: adminKeys.reviews() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression.");
    },
  });
}
