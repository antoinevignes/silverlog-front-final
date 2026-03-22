import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client";

// Définition des clés de query pour l'admin
export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  reviews: () => [...adminKeys.all, "reviews"] as const,
};

export function adminStatsQuery() {
  return queryOptions({
    queryKey: adminKeys.stats(),
    queryFn: () => apiClient<any>("/admin/stats"),
  });
}

export function adminUsersQuery() {
  return queryOptions({
    queryKey: adminKeys.users(),
    queryFn: () => apiClient<any[]>("/admin/users"),
  });
}

export function adminReviewsQuery() {
  return queryOptions({
    queryKey: adminKeys.reviews(),
    queryFn: () => apiClient<any[]>("/admin/reviews"),
  });
}
