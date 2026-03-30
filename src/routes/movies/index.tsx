import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { useToggle } from "@/hooks/use-toggle";
import {
  popularMoviesQuery,
  topRatedMoviesQuery,
} from "@/features/movie/api/movie.queries";
import { popularReviewsQuery } from "@/features/review/api/review.query";
import TopRatedSection from "@/features/movie/components/movies/top-rated/top-rated-section";
import PopularReviews from "@/features/movie/components/movies/popular-reviews/popular-reviews";
import MoviesFilters, {
  type MovieFilters,
} from "@/features/movie/components/movies/movie-filters/movies-filters";
import Title from "@/components/ui/title/title";
import "./movies-page.scss";
import PopularMovies from "@/features/movie/components/movies/popular-movies/popular-movies";
import FilteredResults from "@/features/movie/components/movies/filtered-results/filtered-results";
import Skeleton from "@/components/ui/skeleton/skeleton";

export const Route = createFileRoute("/movies/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(popularMoviesQuery());
    queryClient.prefetchQuery(topRatedMoviesQuery(1));
    queryClient.prefetchQuery(popularReviewsQuery(8));
  },
  component: MoviesPage,
});

function MoviesPage() {
  const [filters, setFilters] = useState<MovieFilters>({});
  const { value: isFiltersOpen, setTrue: openFilters, setFalse: closeFilters } = useToggle();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <main className="movies-page container">
      <header className="movies-header">
        <Title title="Films" variant="h1" size="lg" />
        <p className="movies-tagline text-secondary">
          Explorez, découvrez et suivez les films que vous voulez voir.
        </p>
      </header>

      <div className="movies-layout">
        <aside className="movies-sidebar">
          <MoviesFilters
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFiltersOpen}
            onOpen={openFilters}
            onClose={closeFilters}
          />
        </aside>

        <div className="movies-content">
          {/* RESULTATS RECHERCHE */}
          {hasActiveFilters ? (
            <Suspense
              fallback={
                <div className="results-loading">
                  <Skeleton width="10rem" height="2rem" />

                  <div className="results-grid">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <Skeleton key={i} width="6.5rem" height="9.75rem" />
                    ))}
                  </div>
                </div>
              }
            >
              <FilteredResults filters={filters} />
            </Suspense>
          ) : (
            <div className="default-sections">
              {/* FILMS POPULAIRES */}
              <section className="popular-section">
                <header className="section-header">
                  <Title title="Populaires cette semaine" variant="h2" />
                </header>
                <Suspense
                  fallback={
                    <div className="swiper-loading">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} width="6.5rem" height="9.75rem" />
                      ))}
                    </div>
                  }
                >
                  <PopularMovies />
                </Suspense>
              </section>

              {/* LES MIEUX NOTÉS */}
              <section className="top-rated-section">
                <header className="section-header">
                  <Title title="Les mieux notés" variant="h2" />
                </header>
                <Suspense
                  fallback={
                    <div className="swiper-loading">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} width="6.5rem" height="9.75rem" />
                      ))}
                    </div>
                  }
                >
                  <TopRatedSection />
                </Suspense>
              </section>

              {/* COMMENTAIRES */}
              <section className="popular-reviews-section">
                <header className="section-header">
                  <Title title="Commentaires populaires" variant="h2" />
                </header>
                <Suspense
                  fallback={
                    <div className="reviews-loading">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} width="100%" height="10.25rem" />
                      ))}
                    </div>
                  }
                >
                  <PopularReviews />
                </Suspense>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
