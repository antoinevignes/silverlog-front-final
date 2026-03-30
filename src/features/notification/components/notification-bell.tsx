import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Star, Send } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useSocketContext } from "@/utils/socket-provider";
import {
  notificationsQuery,
  unreadCountQuery,
} from "@/features/notification/api/notification.queries";
import {
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/features/notification/api/notification.mutations";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { User } from "lucide-react";
import "./notification-bell.scss";
import Button from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { notifications: realtimeNotifs } = useSocketContext();
  const { data: dbNotifications } = useQuery(notificationsQuery());
  const { data: unreadData } = useQuery(unreadCountQuery());

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const unreadCount = (unreadData?.count ?? 0) + realtimeNotifs.length;

  const handleNotificationClick = (notification: {
    id: number;
    is_read: boolean;
    movie_id: number;
  }) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    navigate({
      to: "/movies/$movieId",
      params: { movieId: String(notification.movie_id) },
    });
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    queryClient.invalidateQueries({ queryKey: unreadCountQuery().queryKey });
  };

  const allNotifications = [
    ...realtimeNotifs.map((n) => ({
      id: n.id,
      recipient_id: 0,
      sender_id: n.sender_id,
      type: n.type,
      movie_id: n.movie_id,
      review_id: null as number | null,
      message: null as string | null,
      is_read: false,
      created_at: n.created_at,
      sender_username: n.sender_username,
      sender_avatar: n.sender_avatar,
      movie_title: n.movie_title,
      movie_poster: n.movie_poster,
    })),
    ...(dbNotifications ?? []),
  ];

  const dedupedNotifications = allNotifications.filter(
    (notif, index, self) => index === self.findIndex((n) => n.id === notif.id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Notifications"
          variant="ghost"
          size="icon"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="notification-panel">
          <header className="notification-panel-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                Tout marquer comme lu
              </Button>
            )}
          </header>

          {dedupedNotifications.length === 0 ? (
            <p className="notification-empty">
              Aucune notification pour le moment.
            </p>
          ) : (
            <ul className="notification-list">
              {dedupedNotifications.map((notif) => (
                <li
                  key={`${notif.type}-${notif.id}`}
                  className={`notification-item ${!notif.is_read ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notif)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNotificationClick(notif);
                  }}
                >
                  <div className="notification-type-icon">
                    {notif.type === "recommendation" ? (
                      <Send size={14} />
                    ) : (
                      <Star size={14} />
                    )}
                  </div>

                  {notif.sender_avatar ? (
                    <Image
                      src={getCloudinarySrc(notif.sender_avatar, "avatars")}
                      layout="constrained"
                      width={36}
                      height={36}
                      alt={`Avatar de ${notif.sender_username}`}
                      background="auto"
                      className="notification-avatar"
                    />
                  ) : (
                    <div className="notification-avatar-placeholder">
                      <User size={16} />
                    </div>
                  )}

                  <div className="notification-content">
                    <p className="notification-text">
                      <strong>{notif.sender_username}</strong>{" "}
                      {notif.type === "recommendation"
                        ? "vous recommande un film"
                        : "a publié un avis"}
                    </p>
                    <p className="notification-movie">{notif.movie_title}</p>
                    <p className="notification-time">
                      {formatDistanceToNow(new Date(notif.created_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>

                  {notif.movie_poster && (
                    <Image
                      src={getCloudinarySrc(notif.movie_poster, "posters")}
                      layout="constrained"
                      width={32}
                      aspectRatio={2 / 3}
                      alt={`Affiche de ${notif.movie_title}`}
                      background="auto"
                      className="notification-poster"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
