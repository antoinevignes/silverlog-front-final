import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import MovieHeader from "@/features/movie/components/movie-header/movie-header";
import {
  movieCreditsQuery,
  movieDetailsQuery,
  movieFriendsActivityQuery,
  similarMoviesQuery,
} from "@/features/movie/api/movie.queries";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { movieStateQuery } from "@/features/user/api/user-movie.queries";
import Reviews from "@/features/review/components/reviews/reviews";
import MovieHeaderSkeleton from "@/features/movie/components/movie-header/movie-header-skeleton";
import Title from "@/components/ui/title/title";
import "./index.scss";
import FriendsActivity from "@/features/user/components/activity/friends-activity/friends-activity";
import MovieSwiper from "@/components/ui/movie-swiper/movie-swiper";

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
  const { movieId } = Route.useParams();
  const { data: similar } = useSuspenseQuery(similarMoviesQuery(movieId));

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
          fallback={Array.from({ length: 9 }).map((_, index) => (
            <li key={`skeleton-${index}`}>
              <Skeleton width="6.5rem" height="9.75rem" />
            </li>
          ))}
        >
          <MovieSwiper movies={similar.results} />
        </Suspense>
      </section>
    </main>
  );
}
