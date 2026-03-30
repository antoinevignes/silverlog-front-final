import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import type { NotificationType } from "@/features/notification/types/notification";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export const notificationsQuery = () =>
  queryOptions({
    queryKey: notificationKeys.list(),
    queryFn: () => apiClient<NotificationType[]>("/notifications"),
  });

export const unreadCountQuery = () =>
  queryOptions({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => apiClient<{ count: number }>("/notifications/unread-count"),
  });
