import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import type { UserType, FeedActivityType } from "@/utils/types/user";

export const userQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["user", user_id],
    queryFn: () => apiClient<UserType>(`/user/${user_id}`),
  });

export const userFollowersQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["followers", user_id],
    queryFn: () => apiClient<UserType[]>(`/user/${user_id}/followers`),
  });

export const userFollowingQuery = (user_id: string) =>
  queryOptions({
    queryKey: ["following", user_id],
    queryFn: () => apiClient<UserType[]>(`/user/${user_id}/following`),
  });

export const userFeedQuery = () =>
  queryOptions({
    queryKey: ["user", "feed"],
    queryFn: () => apiClient<FeedActivityType[]>("/user/feed"),
  });
