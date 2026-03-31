export type NotificationType = {
  id: number;
  recipient_id: number;
  sender_id: number;
  type: "review" | "recommendation" | "follow";
  movie_id: number | null;
  review_id: number | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  sender_username: string;
  sender_avatar: string | null;
  movie_title: string | null;
  movie_poster: string | null;
};

export type RealtimeNotification = {
  id: number;
  type: "review" | "recommendation" | "follow";
  sender_id: number;
  sender_username: string;
  sender_avatar: string | null;
  movie_id: number | null;
  movie_title: string | null;
  movie_poster: string | null;
  review_content?: string;
  created_at: string;
};
