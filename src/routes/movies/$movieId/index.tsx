import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import MovieHeader from "../../../components/layout/movie-header/movie-header";
import type { MovieType } from "@/utils/types/movie";
import HorizontalScroller from "@/components/layout/horizontal-scroller/horizontal-scroller";
import MovieCard from "@/components/layout/movie-card/movie-card";
import {
  movieCreditsQuery,
  movieDetailsQuery,
  movieFriendsActivityQuery,
  similarMoviesQuery,
} from "@/queries/movie.queries";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { movieStateQuery } from "@/queries/user-movie.queries";
import Reviews from "@/components/layout/reviews/reviews";
import MovieHeaderSkeleton from "@/components/layout/movie-header/movie-header-skeleton";
import Title from "@/components/layout/title/title";
import "./index.scss";
import FriendsActivity from "@/components/layout/activity/friends-activity/friends-activity";

export const Route = createFileRoute("/movies/$movieId/")({
  loader: ({ context: { queryClient }, params: { movieId } }) => {
    queryClient.prefetchQuery(movieDetailsQuery(movieId));
    queryClient.prefetchQuery(movieCreditsQuery(movieId));
    queryClient.prefetchQuery(movieStateQuery(movieId));
    queryClient.prefetchQuery(similarMoviesQuery(movieId));
    queryClient.prefetchQuery(movieFriendsActivityQuery(movieId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Suspense fallback={<MovieHeaderSkeleton />}>
        <MovieHeader />
      </Suspense>

      <section className="friends-activity container">
        <Suspense fallback={<Skeleton width="100%" height="150px" />}>
          <FriendsActivity />
        </Suspense>
      </section>

      <section className="reviews container">
        <Title title="Avis de la communauté" />

        <Suspense
          fallback={
            <ul className="review-list">
              {Array.from({ length: 3 }).map((_, index) => (
                <li key={`skeleton-${index}`}>
                  <Skeleton width="100%" height="8rem" />
                </li>
              ))}
            </ul>
          }
        >
          <Reviews />
        </Suspense>
      </section>

      <section className="suggestions container">
        <Title title="Films similaires" />

        <Suspense
          fallback={
            <HorizontalScroller className="movie-scroller">
              {Array.from({ length: 9 }).map((_, index) => (
                <li key={`skeleton-${index}`}>
                  <Skeleton width="6.5rem" height="9.75rem" />
                </li>
              ))}
            </HorizontalScroller>
          }
        >
          <SimilarMovies />
        </Suspense>
      </section>
    </main>
  );
}

function SimilarMovies() {
  const { movieId } = Route.useParams();

  const { data: similar } = useSuspenseQuery(similarMoviesQuery(movieId));

  return (
    <HorizontalScroller className="movie-scroller">
      {similar.results.map((movie: MovieType) => (
        <li key={movie.id}>
          <MovieCard movie={movie} size="sm" />
        </li>
      ))}
    </HorizontalScroller>
  );
}
