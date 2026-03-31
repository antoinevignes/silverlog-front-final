import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import PopularMovies from "@/features/movie/components/movies/film-page-popular-movies/film-page-popular-movies";
import FilteredResults from "@/features/movie/components/movies/filtered-results/filtered-results";
import { SuspenseSection } from "@/components/ui/suspense-section/suspense-section";
import FilteredResultsSkeletons from "@/features/movie/components/movies/filtered-results/filtered-results-skeleton";
import FilmPageSkeleton from "@/components/layout/skeletons/film-page-skeleton";
import PopularReviewsSkeleton from "@/features/movie/components/movies/popular-reviews/popular-reviews-skeleton";
import { Seo } from "@/components/seo/seo";

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
  const {
    value: isFiltersOpen,
    setTrue: openFilters,
    setFalse: closeFilters,
  } = useToggle();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <>
      <Seo
        title="Films"
        description="Explorez les films populaires et les mieux notés. Filtrez par genre, année et plus encore sur Silverlog."
        type="website"
      />
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
            <SuspenseSection
              title="Résultats de la recherche"
              fallback={<FilteredResultsSkeletons />}
            >
              <FilteredResults filters={filters} />
            </SuspenseSection>
          ) : (
            <div className="default-sections">
              {/* FILMS POPULAIRES */}
              <SuspenseSection
                title="Populaires cette semaine"
                fallback={<FilmPageSkeleton />}
              >
                <PopularMovies />
              </SuspenseSection>

              {/* LES MIEUX NOTÉS */}
              <SuspenseSection
                title="Les mieux notés"
                fallback={<FilmPageSkeleton />}
              >
                <TopRatedSection />
              </SuspenseSection>

              {/* COMMENTAIRES */}
              <SuspenseSection
                title="Commentaires populaires"
                fallback={<PopularReviewsSkeleton />}
              >
                <PopularReviews />
              </SuspenseSection>
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  );
}
