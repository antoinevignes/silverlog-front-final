import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/auth";
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/features/notification/api/notification.queries";
import type { RealtimeNotification } from "@/features/notification/types/notification";

type SocketContextType = {
  socket: Socket | null;
  notifications: RealtimeNotification[];
  clearNotifications: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  clearNotifications: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(
    [],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("notification", (notification: RealtimeNotification) => {
      setNotifications((prev) => [notification, ...prev]);
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, queryClient]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
