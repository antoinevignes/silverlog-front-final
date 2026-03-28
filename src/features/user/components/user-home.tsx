import { Link } from "@tanstack/react-router";
import { Clock, Star, BookmarkPlus } from "lucide-react";
import Button from "@/components/ui/button/button";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import { useAuth } from "@/auth";
import "./user-home.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image } from "@unpic/react";
import { Avatar } from "@/components/ui/avatar/avatar";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import {
  crewPicksQuery,
  popularMoviesQuery,
} from "@/features/movie/api/movie.queries";
import { userFeedQuery, userQuery } from "@/features/user/api/user.queries";
import type { MovieType } from "@/features/movie/types/movie";
import Badge from "@/components/ui/badge/badge";
import Title from "@/components/ui/title/title";
import MovieSwiper from "@/components/ui/movie-swiper/movie-swiper";

export default function UserHome() {
  const { user } = useAuth();

  const { data: popularMovies } = useSuspenseQuery(popularMoviesQuery());
  const { data: feedData } = useSuspenseQuery(userFeedQuery());
  const { data: crewPicks } = useSuspenseQuery(crewPicksQuery());
  const { data: userData } = useSuspenseQuery(userQuery(user!.id));

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
                <strong>{userData?.viewed_movies_this_month_count ?? 0}</strong>{" "}
                films vus ce mois
              </span>
            </Badge>

            <Badge variant="outline" size="lg">
              <BookmarkPlus size={16} className="stat-icon" />
              <span>
                <strong>{userData?.recent_watchlist_count ?? 0}</strong> envies
                récentes
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

        <MovieSwiper movies={popularMovies.results} />
      </section>

      <section className="container selection-section">
        <Title title="La sélection de la rédaction" className="section-title" />

        <ul className="selection-grid">
          {crewPicks && crewPicks.length > 0 ? (
            crewPicks.map((movie: MovieType) => (
              <>
                <li key={movie.id} className="card-mobile">
                  <MovieCard movie={movie} size="sm" />
                </li>
                <li className="card-desktop">
                  <MovieCard movie={movie} size="md" />
                </li>
              </>
            ))
          ) : (
            <p className="text-secondary text-center">
              Chargement de la sélection...
            </p>
          )}
        </ul>
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
    </main>
  );
}
