import { Link } from "@tanstack/react-router";
import { Star, BookmarkPlus } from "lucide-react";
import "./user-home.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image } from "@unpic/react";
import { Avatar } from "@/components/ui/avatar/avatar";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { userFeedQuery } from "@/features/user/api/user.queries";
import Title from "@/components/ui/title/title";
import CrewPicks from "@/features/movie/components/crew-picks/crew-picks";

export default function UserHome() {
  const { data: feedData } = useSuspenseQuery(userFeedQuery());

  return (
    <>
      <CrewPicks />

      <section className="container feed-section">
        <Title title="Activité de vos abonnements" />

        <div className="activity-feed">
          {feedData && feedData.length > 0 ? (
            feedData.map((activity: any, index: number) => (
              <article
                key={`${activity.movie_id}-${activity.user_id}-${index}`}
                className="activity-card"
              >
                <header className="activity-header">
                  <Link
                    to="/user/$userId"
                    params={{ userId: activity.user_id.toString() }}
                    className="user-link"
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

                <div className="activity-body">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: activity.movie_id.toString() }}
                    className="movie-poster-link"
                  >
                    <Image
                      src={getCloudinarySrc(activity.poster_path, "posters")}
                      background="auto"
                      layout="fullWidth"
                      aspectRatio={2 / 3}
                      alt={`Affiche du film ${activity.title}`}
                      className="feed-movie-poster"
                    />
                  </Link>

                  <div className="feed-content">
                    <h4 className="feed-movie-title font-sentient">
                      {activity.title}
                    </h4>

                    {activity.type === "rating" && (
                      <div className="feed-review">
                        <div className="feed-review-header text-secondary">
                          {activity.review_content
                            ? "a noté et critiqué le film "
                            : "a noté ce film "}

                          {activity.rating && (
                            <span className="feed-rating">
                              {activity.rating / 2}/10{" "}
                              <Star
                                size={12}
                                fill="currentColor"
                                color="#f5c518"
                                className="star-icon"
                              />
                            </span>
                          )}
                        </div>

                        {activity.review_content && (
                          <p className="feed-text">
                            "{activity.review_content}"
                          </p>
                        )}
                      </div>
                    )}

                    {activity.type === "watchlist" && (
                      <div className="feed-list-action text-secondary">
                        <BookmarkPlus size={14} />
                        Ajouté à sa Watchlist
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-secondary text-center">
              Aucune activité récente parmi vos abonnements.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
