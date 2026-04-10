import { useSuspenseQuery } from "@tanstack/react-query";
import { userFeedQuery } from "../../api/user.queries";
import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/avatar/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { BookmarkPlus, Star, UserX } from "lucide-react";
import "./friends-feed.scss";

export default function FriendsFeed() {
  const { data: feedData } = useSuspenseQuery(userFeedQuery());

  return (
    <div className="activity-feed gap-lg">
      {feedData && feedData.length > 0 ? (
        feedData.map((activity: any, index: number) => (
          <article
            key={`${activity.movie_id}-${activity.user_id}-${index}`}
            className="activity-card p-sm"
          >
            <header className="activity-header mb-md pb-sm">
              <Link
                to="/user/$userId"
                params={{ userId: activity.user_id.toString() }}
                className="user-link gap-sm"
              >
                <Avatar
                  username={activity.username}
                  src={activity.avatar_path}
                  size="sm"
                  className="avatar-placeholder"
                />

                <strong>{activity.username}</strong>
              </Link>

              <time
                className="activity-time text-secondary"
                dateTime={activity.created_at}
              >
                {formatDistanceToNow(new Date(activity.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
              </time>
            </header>

            <div className="activity-body gap-md">
              <Link
                to="/movies/$movieId"
                params={{ movieId: activity.movie_id.toString() }}
                className="movie-poster-link"
              >
                <Image
                  src={getCloudinarySrc(activity.poster_path, "posters")}
                  layout="constrained"
                  width={80}
                  aspectRatio={2 / 3}
                  alt={`Affiche du film ${activity.title}`}
                  background="auto"
                  loading="lazy"
                  decoding="async"
                  className="feed-movie-poster"
                />
              </Link>

              <div className="feed-content">
                <h4 className="feed-movie-title font-fraunces mb-xs">
                  {activity.title}
                </h4>

                {activity.type === "rating" && (
                  <div className="feed-review mt-sm">
                    <div className="feed-review-header text-secondary mb-sm">
                      {activity.review_content
                        ? "a noté et critiqué le film "
                        : "a noté ce film "}
                      {activity.rating && (
                        <span className="feed-rating ml-xs">
                          {activity.rating / 2}/10{" "}
                          <Star
                            size={12}
                            fill="currentColor"
                            color="#f5c518"
                            className="star-icon ml-xs"
                          />
                        </span>
                      )}
                    </div>

                    {activity.review_content && (
                      <p className="feed-text pl-sm">
                        "{activity.review_content}"
                      </p>
                    )}
                  </div>
                )}

                {activity.type === "watchlist" && (
                  <div className="feed-list-action text-secondary mt-xs gap-xs">
                    <BookmarkPlus size={14} />
                    Ajouté à sa Watchlist
                  </div>
                )}
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="friends-feed-empty gap-md">
          <UserX size={48} />
          <p className="text-secondary">
            Aucune activité récente parmi vos abonnements.
          </p>
        </div>
      )}
    </div>
  );
}
