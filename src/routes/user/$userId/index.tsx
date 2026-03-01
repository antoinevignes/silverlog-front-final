import "./index.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star, TextAlignStart } from "lucide-react";
import type { MovieType } from "@/utils/types/movie";
import { Separator } from "@/components/ui/separator";
import { userQuery } from "@/queries/user.queries";
import Button from "@/components/ui/button/button";
import MovieCard from "@/components/layout/movie-card/movie-card";
import Title from "@/components/layout/title/title";
import HorizontalScroller from "@/components/layout/horizontal-scroller/horizontal-scroller";

export const Route = createFileRoute("/user/$userId/")({
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    await queryClient.prefetchQuery(userQuery(userId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { data: user } = useSuspenseQuery(userQuery(userId));

  console.log(user);

  return (
    <main className="user-profile">
      <div className="profile-backdrop" aria-hidden="true">
        <picture>
          <source
            srcSet={`https://image.tmdb.org/t/p/w1280/zpEWFNqoN8Qg1SzMMHmaGyOBTdW.jpg`}
            media="(min-width: 768px)"
          />
          <img
            src={`https://image.tmdb.org/t/p/w1280/zpEWFNqoN8Qg1SzMMHmaGyOBTdW.jpg`}
            alt=""
            className="backdrop-image"
          />
        </picture>
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container profile-layout">
        <header className="profile-header">
          <div className="avatar-stats-row">
            <div className="avatar-container">
              <div
                className="avatar font-sentient"
                aria-label={`Initiale de ${user.username}`}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-value">{user.viewed_movies}</span>
                <span className="stat-label">Films</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {user.viewed_movies_this_year}
                </span>
                <span className="stat-label">Cette année</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  <Star size={14} fill="currentColor" className="star-icon" />
                  {user.avg_rating}
                </span>
                <span className="stat-label">Note Moy.</span>
              </div>
            </div>
          </div>

          <div className="user-info-section">
            <div className="name-action-row">
              <h1 className="username">{user.username}</h1>
              <Button size="sm" className="follow-btn">
                Suivre
              </Button>
            </div>

            {user.description && <p className="user-bio">{user.description}</p>}

            <div className="user-social-stats">
              <span>
                <strong>145</strong> Abonnés
              </span>
              <span>
                <strong>49</strong> Abonnements
              </span>
            </div>

            <div className="user-meta">
              {user.location && (
                <span className="meta-item">
                  <MapPin size={14} />
                  {user.location}
                </span>
              )}
            </div>
          </div>
        </header>

        <section className="profile-content">
          <Separator />

          <div className="content-section">
            <Title title="Top 6" />

            <div className="top-movies-grid">
              {user.top_movies.map((movie: MovieType) => (
                <MovieCard key={movie.id} movie={movie} size="md" />
              ))}
            </div>
          </div>

          <div className="content-section">
            <Title title="Activité récente" />

            <HorizontalScroller className="recent-activity-scroller">
              {user.recent_activity.map((movie: any) => (
                <li key={movie.id} className="activity-item">
                  <MovieCard movie={movie} size="md" />

                  <div className="activity-meta">
                    <div className="rating-stars">
                      {Array.from({ length: movie.rating / 2 }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={10}
                            fill="#F2C265"
                            stroke="#F2C265"
                          />
                        ),
                      )}
                    </div>

                    {movie.review_content && (
                      <span className="review-icon">
                        <TextAlignStart size={10} />
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </HorizontalScroller>
          </div>
        </section>
      </div>
    </main>
  );
}
