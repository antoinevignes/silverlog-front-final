import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { MessageSquare, Star } from "lucide-react";
import { movieFriendsActivityQuery } from "@/features/movie/api/movie.queries";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog/dialog";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./friends-activity.scss";
import Badge from "@/components/ui/badge/badge";
import Title from "@/components/ui/title/title";

export default function FriendsActivity() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const { data: activities } = useSuspenseQuery(
    movieFriendsActivityQuery(movieId),
  );

  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  if (!activities || activities.length === 0) {
    return;
  }

  return (
    <>
      <Title title="Activité de vos amis" />

      <div className="friends-avatars-list">
        {activities.map((activity: any, index: number) => (
          <div
            key={`${activity.user_id}-${index}`}
            className="friend-avatar-item"
          >
            <div className="friend-card-container">
              <Link
                to="/user/$userId"
                params={{ userId: activity.user_id.toString() }}
                className="friend-link"
              >
                <div className="avatar-wrapper">
                  {activity.avatar_path ? (
                    <Image
                      src={getCloudinarySrc(activity.avatar_path, "avatars")}
                      layout="constrained"
                      width={60}
                      height={60}
                      alt={`Avatar de${activity.username}`}
                      background="auto"
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar-init">
                      {activity.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>

              {activity.review_content && (
                <button
                  className="review-indicator"
                  aria-label="Voir la critique"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <MessageSquare size={14} fill="currentColor" />
                </button>
              )}

              {activity.rating && (
                <Badge className="friend-rating" variant="secondary">
                  <Star size={14} fill="#F2C265" color="#F2C265" />
                  {activity.rating / 2}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedActivity}
        onOpenChange={(open) => !open && setSelectedActivity(null)}
      >
        <DialogContent>
          {selectedActivity && (
            <div className="review-modal-content">
              <header className="modal-header">
                <div className="modal-user-info">
                  <div className="modal-avatar">
                    {selectedActivity.avatar_path ? (
                      <Image
                        src={getCloudinarySrc(
                          selectedActivity.avatar_path,
                          "avatars",
                        )}
                        layout="constrained"
                        width={44}
                        height={44}
                        alt={`Avatar de ${selectedActivity.username}`}
                        background="auto"
                        className="avatar"
                      />
                    ) : (
                      <div className="avatar-init">
                        {selectedActivity.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="modal-user-meta">
                    <h3 className="modal-username font-sentient">
                      {selectedActivity.username}
                    </h3>
                    <time className="text-secondary modal-time">
                      {formatDistanceToNow(
                        new Date(selectedActivity.created_at),
                        {
                          addSuffix: true,
                          locale: fr,
                        },
                      )}
                    </time>
                  </div>
                </div>
              </header>

              <div className="modal-review-body">
                <div className="modal-rating">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={
                          i < Math.floor(selectedActivity.rating / 4)
                            ? "#F2C265"
                            : "none"
                        }
                        color={
                          i < Math.floor(selectedActivity.rating / 4)
                            ? "#F2C265"
                            : "v.$c-text"
                        }
                      />
                    ))}
                  </div>
                  <span className="rating-value font-sentient">
                    {selectedActivity.rating / 2}/10
                  </span>
                </div>
                <p className="review-text">
                  "{selectedActivity.review_content}"
                </p>
              </div>

              <footer className="modal-footer">
                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedActivity(null)}
                >
                  Fermer
                </button>
              </footer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
