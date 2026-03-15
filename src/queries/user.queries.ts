import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";

export const userQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["user", user_id],
    queryFn: () => apiClient<any>(`/user/${user_id}`),
  });

export const userFollowersQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["followers", user_id],
    queryFn: () => apiClient<any[]>(`/user/${user_id}/followers`),
  });

export const userFollowingQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["following", user_id],
    queryFn: () => apiClient<any[]>(`/user/${user_id}/following`),
  });

export const userFeedQuery = () =>
  queryOptions({
    queryKey: ["user", "feed"],
    queryFn: () => apiClient<any[]>("/user/feed"),
  });
