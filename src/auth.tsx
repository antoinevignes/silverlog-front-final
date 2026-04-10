import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { userKeys } from "@/utils/query-keys";
import type { UserType } from "@/features/user/types/user";

export interface AuthState {
  isAuthenticated: boolean;
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: authData, isPending } = useQuery({
    queryKey: userKeys.session(),
    queryFn: async () => {
      try {
        return await apiClient<{
          user: UserType | null;
          isAuthenticated: boolean;
        }>("/auth/session");
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      apiClient<UserType>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.session(), {
        user: data,
        isAuthenticated: true,
      });
      toast.success("Connecté !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const logout = () => {
    queryClient.setQueryData(userKeys.session(), {
      user: null,
      isAuthenticated: false,
    });
    apiClient("/auth/sign-out", { method: "POST" });
  };

  if (isPending) return null;

  return (
    <AuthContext.Provider
      value={{
        user: authData?.user ?? null,
        isAuthenticated: authData?.isAuthenticated ?? false,
        login: async (email, password) => {
          await loginMutation.mutateAsync({ email, password });
        },
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
