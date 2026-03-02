import "./index.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Edit, MapPin, Star, TextAlignStart } from "lucide-react";
import { Suspense, useState } from "react";
import type { MovieType } from "@/utils/types/movie";
import { userQuery } from "@/queries/user.queries";
import Button from "@/components/ui/button/button";
import MovieCard from "@/components/layout/movie-card/movie-card";
import Title from "@/components/layout/title/title";
import HorizontalScroller from "@/components/layout/horizontal-scroller/horizontal-scroller";
import Tabs from "@/components/ui/tabs/tabs";
import Watchlist from "@/components/layout/user/watchlist/watchlist";
import Lists from "@/components/layout/user/lists/lists";
import { useAuth } from "@/auth";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";

export const Route = createFileRoute("/user/$userId/")({
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    await queryClient.prefetchQuery(userQuery(userId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const { userId } = Route.useParams();
  const { data: userData } = useSuspenseQuery(userQuery(userId));

  const [selected, setSelected] = useState<string>("a-propos");

  const tabs =
    Number(user?.id) === Number(userId)
      ? [
          { id: "a-propos", label: "À propos" },
          {
            id: "watchlist",
            label: `Watchlist (${userData.watchlist_total})`,
          },
          { id: "lists", label: `Listes (${userData.custom_lists_total})` },
        ]
      : [
          { id: "a-propos", label: "À propos" },
          { id: "lists", label: `Listes (${userData.custom_lists_total})` },
        ];

  return (
    <main className="user-profile">
      {/* FIGURE A MODIFIER */}
      <figure className="profile-backdrop" aria-hidden="true">
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
      </figure>

      <article className="container profile-layout">
        <header className="profile-header">
          <div className="avatar-stats-row">
            <figure className="avatar-container">
              {userData.avatar_path ? (
                <Image
                  src={getCloudinarySrc(userData.avatar_path, "avatars")}
                  layout="fullWidth"
                  aspectRatio={1 / 1}
                  alt={userData.username}
                  background={getCloudinaryPlaceholder(
                    userData.avatar_path,
                    "avatars",
                  )}
                  priority
                  className="avatar"
                />
              ) : (
                <div
                  className="avatar font-sentient"
                  aria-label={`Initiale de ${userData.username}`}
                >
                  {userData.username
                    ? userData.username.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
            </figure>

            <ul className="stats-container" role="list">
              <li className="stat-item">
                <strong className="stat-value">
                  {userData.viewed_movies_count}
                </strong>
                <span className="stat-label">Films</span>
              </li>

              <li className="stat-item">
                <strong className="stat-value">
                  {userData.viewed_movies_this_year_count}
                </strong>
                <span className="stat-label">Cette année</span>
              </li>

              <li className="stat-item">
                <strong className="stat-value">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="star-icon"
                    aria-hidden="true"
                  />
                  {userData.avg_rating}
                </strong>
                <span className="stat-label">Note Moy.</span>
              </li>
            </ul>
          </div>

          <section
            className="user-info-section"
            aria-label="Informations de l'utilisateur"
          >
            <div className="name-action-row">
              <h1 className="username">{userData.username}</h1>

              {Number(user?.id) === Number(userId) ? (
                <Link
                  to="/user/settings"
                  className="settings-link"
                  aria-label="Paramètres du profil"
                >
                  <Button size="icon" variant="ghost">
                    <Edit
                      size={16}
                      aria-label="Accéder au paramêtres du compte"
                    />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" className="follow-btn">
                  Suivre
                </Button>
              )}
            </div>

            {userData.description && (
              <p className="user-bio">{userData.description}</p>
            )}

            <div className="user-social-stats">
              <span>
                <strong>145</strong> Abonnés
              </span>

              <span>
                <strong>49</strong> Abonnements
              </span>
            </div>

            <address className="user-meta" style={{ fontStyle: "normal" }}>
              {userData.location && (
                <span className="meta-item">
                  <MapPin size={14} aria-hidden />
                  {userData.location}
                </span>
              )}
            </address>
          </section>

          {/* STATS AFFICHER ICI */}
        </header>

        <Tabs
          selected={selected}
          setSelected={setSelected}
          tabs={tabs}
          variant="transparent"
        />

        <section className="profile-content" aria-label="Contenu du profil">
          {selected === "a-propos" && (
            <>
              <section
                className="content-section"
                aria-labelledby="top-movies-title"
              >
                <Title title="Top 6" id="top-movies-title" />

                <ul className="top-movies-grid" role="list">
                  {userData.top_movies.map((movie: MovieType) => (
                    <>
                      <li key={movie.id} className="card-mobile">
                        <MovieCard movie={movie} size="sm" />
                      </li>
                      <li className="card-desktop">
                        <MovieCard movie={movie} size="md" />
                      </li>
                    </>
                  ))}
                </ul>
              </section>

              <section
                className="content-section"
                aria-labelledby="recent-activity-title"
              >
                <Title title="Activité récente" id="recent-activity-title" />

                <HorizontalScroller className="recent-activity-scroller">
                  {userData.recent_activity.map((movie: any) => (
                    <li key={movie.id} className="activity-item">
                      <MovieCard movie={movie} size="sm" />

                      <div className="activity-meta">
                        <div
                          className="rating-stars"
                          aria-label={`Note : ${movie.rating / 2} sur 5`}
                        >
                          {Array.from({ length: movie.rating / 2 }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                size={10}
                                fill="#F2C265"
                                stroke="#F2C265"
                                aria-hidden
                              />
                            ),
                          )}
                        </div>

                        {movie.review_content && (
                          <span
                            className="review-icon"
                            aria-label="Critique rédigée"
                          >
                            <TextAlignStart size={10} aria-hidden />
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </HorizontalScroller>
              </section>
            </>
          )}

          {selected === "watchlist" && Number(user?.id) === Number(userId) && (
            <Suspense
              fallback={
                <ul className="watchlist-grid">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <li key={index}>
                      <Skeleton className="poster-skeleton" />
                    </li>
                  ))}
                </ul>
              }
            >
              <Watchlist />
            </Suspense>
          )}

          {selected === "lists" && (
            <Suspense
              fallback={
                <div className="lists-skeleton-grid">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="list-card-skeleton">
                      <div className="skeleton-info">
                        <Skeleton height={20} width="80%" />
                        <Skeleton height={24} width="30%" />
                        <Skeleton height={14} width="90%" />
                        <Skeleton height={14} width="60%" />
                        <Skeleton height={14} width="40%" />
                      </div>
                      <div className="skeleton-posters">
                        <Skeleton className="poster depth-2" />
                        <Skeleton className="poster depth-1" />
                        <Skeleton className="poster depth-0" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <Lists />
            </Suspense>
          )}
        </section>
      </article>
    </main>
  );
}
