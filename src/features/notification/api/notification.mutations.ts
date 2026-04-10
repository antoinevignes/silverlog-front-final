import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import { notificationKeys } from "@/features/notification/api/notification.queries";
import { toast } from "sonner";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      apiClient(`/notifications/${notificationId}/read`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient("/notifications/read-all", { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useSendRecommendation() {
  return useMutation({
    mutationFn: ({
      recipientId,
      movieId,
    }: {
      recipientId: string;
      movieId: number;
    }) =>
      apiClient("/recommendation", {
        method: "POST",
        body: JSON.stringify({ recipient_id: recipientId, movie_id: movieId }),
      }),
    onSuccess: () => {
      toast.success("Recommandation envoyée !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
