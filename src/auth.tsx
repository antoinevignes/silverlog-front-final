import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import { toast } from "sonner";

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/session`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) return { user: null, isAuthenticated: false };

      return data;
    },
    staleTime: Infinity,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      return data;
    },
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
    fetch(`${import.meta.env.VITE_API_URL}/user/sign-out`, {
      method: "POST",
      credentials: "include",
    });
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
