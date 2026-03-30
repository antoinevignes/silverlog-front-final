import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  crewPicksQuery,
  popularMoviesQuery,
} from "@/features/movie/api/movie.queries";
import { popularReviewsQuery } from "@/features/review/api/review.query";
import { publicListsQuery } from "@/features/list/api/list.queries";
import { activeUsersQuery } from "@/features/user/api/user.queries";
import ActiveUsers from "@/features/user/components/discover/active-users";
import ListCard from "@/features/list/components/list-card/list-card";
import PopularReviews from "@/features/movie/components/movies/popular-reviews/popular-reviews";
import Title from "@/components/ui/title/title";
import Skeleton from "@/components/ui/skeleton/skeleton";
import "./discover-page.scss";
import CrewPicks from "@/features/movie/components/crew-picks/crew-picks";
import PopularMoviesLg from "@/features/movie/components/movies/popular-movies/popular-movies";

export const Route = createFileRoute("/discover/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(crewPicksQuery());
    queryClient.prefetchQuery(popularMoviesQuery());
    queryClient.prefetchQuery(popularReviewsQuery(10));
    queryClient.prefetchQuery(activeUsersQuery());
    queryClient.prefetchQuery(publicListsQuery());
  },
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <main className="discover-page">
      <header className="container discover-header">
        <Title title="Découvrir" variant="h1" size="lg" />
        <p className="discover-tagline text-secondary">
          Explorez les dernières tendances et découvrez de nouveaux films.
        </p>
      </header>

      <CrewPicks />

      <PopularMoviesLg />

      <section className="container reviews-and-users">
        <div className="reviews-column">
          <header className="section-header">
            <Title title="Commentaires populaires" variant="h2" />
          </header>
          <Suspense
            fallback={
              <div className="reviews-loading">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width="100%" height="10rem" />
                ))}
              </div>
            }
          >
            <div className="popular-reviews-section">
              <PopularReviews limit={5} />
            </div>
          </Suspense>
        </div>

        <aside className="users-sidebar">
          <header className="section-header">
            <Title title="Utilisateurs actifs" variant="h2" />
          </header>
          <Suspense
            fallback={
              <div className="users-loading">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} width="100%" height="4rem" />
                ))}
              </div>
            }
          >
            <ActiveUsers />
          </Suspense>
        </aside>
      </section>

      <section className="container public-lists-section">
        <header className="section-header">
          <Title title="Listes publiques" variant="h2" />
        </header>
        <Suspense
          fallback={
            <div className="lists-loading">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} width="100%" height="10rem" />
              ))}
            </div>
          }
        >
          <PublicLists />
        </Suspense>
      </section>
    </main>
  );
}

function PublicLists() {
  const { data: lists } = useSuspenseQuery(publicListsQuery());

  if (!lists || lists.length === 0) {
    return null;
  }

  return (
    <div className="discover-lists-grid">
      {lists.slice(0, 10).map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
