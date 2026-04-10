import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";
import { userKeys } from "@/utils/query-keys";
import type {
  UserType,
  FeedActivityType,
  ActiveUser,
} from "@/features/user/types/user";

export const userQuery = (user_id: string) =>
  queryOptions({
    queryKey: userKeys.detail(user_id),
    queryFn: () => apiClient<UserType>(`/user/${user_id}`),
  });

export const userFollowersQuery = (user_id: string) =>
  queryOptions({
    queryKey: userKeys.followers(user_id),
    queryFn: () => apiClient<UserType[]>(`/user/${user_id}/followers`),
  });

export const userFollowingQuery = (user_id: string) =>
  queryOptions({
    queryKey: userKeys.following(user_id),
    queryFn: () => apiClient<UserType[]>(`/user/${user_id}/following`),
  });

export const userFeedQuery = () =>
  queryOptions({
    queryKey: userKeys.feed(),
    queryFn: () => apiClient<FeedActivityType[]>("/user/feed"),
  });

export const userSearchQuery = (query: string) =>
  queryOptions({
    queryKey: userKeys.search(query),
    queryFn: () =>
      apiClient<UserType[]>("/user/search", {
        params: { q: query },
      }),
    enabled: !!query,
  });

export const activeUsersQuery = () =>
  queryOptions({
    queryKey: userKeys.active(),
    queryFn: () => apiClient<ActiveUser[]>("/user/active"),
  });
