import { Link } from "@tanstack/react-router";
import { Clock, Star, BookmarkPlus } from "lucide-react";
import Button from "@/components/ui/button/button";
import MovieCard from "@/components/layout/movie-card/movie-card";
import HorizontalScroller from "@/components/layout/horizontal-scroller/horizontal-scroller";
import { useAuth } from "@/auth";
import "./user-home.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import { popularMoviesQuery } from "@/queries/movie.queries";
import { userFeedQuery } from "@/queries/user.queries";
import type { MovieType } from "@/utils/types/movie";
import Badge from "@/components/ui/badge/badge";
import Title from "../title/title";

export default function UserHome() {
  const { user } = useAuth();

  const { data: popularMovies } = useSuspenseQuery(popularMoviesQuery());
  const { data: feedData } = useSuspenseQuery(userFeedQuery());

  return (
    <main className="user-home">
      <header className="home-dashboard-header">
        <div className="container header-container">
          <div className="welcome-section">
            <h1 className="welcome-title font-sentient">
              Bon retour,{" "}
              <span className="highlight-user">{user?.username}</span> !
            </h1>
            <p className="welcome-subtitle text-secondary">
              Voici ce qu'il s'est passé depuis votre dernière visite.
            </p>
          </div>

          <div className="quick-stats-row">
            <Badge variant="outline" size="lg">
              <Clock size={16} className="stat-icon" />
              <span>
                <strong>12</strong> films vus ce mois
              </span>
            </Badge>

            <Badge variant="outline" size="lg">
              <BookmarkPlus size={16} className="stat-icon" />
              <span>
                <strong>4</strong> envies récentes
              </span>
            </Badge>
          </div>
        </div>
      </header>

      <section className="container trending-section">
        <header className="section-header">
          <Title title="Populaire cette semaine" />

          <Button variant="ghost" size="sm" className="hidden-mobile">
            Voir plus
          </Button>
        </header>

        <HorizontalScroller>
          {popularMovies.results.map((movie: MovieType) => (
            <li key={movie.id} className="trending-card-wrapper">
              <MovieCard movie={movie} />
            </li>
          ))}
        </HorizontalScroller>
      </section>

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
                    <div className="avatar-placeholder">
                      {activity.avatar_path ? (
                        <Image
                          src={getCloudinarySrc(
                            activity.avatar_path,
                            "avatars",
                          )}
                          layout="constrained"
                          width={32}
                          height={32}
                          alt={activity.username}
                          background={getCloudinaryPlaceholder(
                            activity.avatar_path,
                            "avatars",
                          )}
                          className="avatar"
                        />
                      ) : (
                        activity.username.charAt(0).toUpperCase()
                      )}
                    </div>

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
                      background={getCloudinaryPlaceholder(
                        activity.poster_path,
                        "posters",
                      )}
                      layout="fullWidth"
                      alt={activity.title}
                      className="feed-movie-poster"
                    />
                  </Link>

                  <div className="feed-content">
                    <h4 className="feed-movie-title font-sentient">
                      {activity.title}
                    </h4>

                    {activity.type === "rating" && (
                      <div className="feed-review">
                        <div
                          className="feed-review-header text-secondary"
                          style={{ fontSize: "0.85rem", marginBottom: "4px" }}
                        >
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
                                style={{ marginLeft: "2px" }}
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
    </main>
  );
}
