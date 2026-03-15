import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";

interface User {
  id: string;
  username: string;
  email: string;
  top_list_id: string;
  watchlist_id: string;
  avatar_path: string | null;
  banner_path: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: authData, isPending } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        return await apiClient<any>("/auth/session");
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      apiClient<any>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], {
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
    queryClient.setQueryData(["session"], {
      user: null,
      isAuthenticated: false,
    });
    apiClient("/auth/sign-out", { method: "POST" });
  };

  if (isPending) return <></>;

  return (
    <AuthContext.Provider
      value={{
        user: authData?.user,
        isAuthenticated: authData?.isAuthenticated,
        login: (email, password) =>
          loginMutation.mutateAsync({ email, password }),
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
