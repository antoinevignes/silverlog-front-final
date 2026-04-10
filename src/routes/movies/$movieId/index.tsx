import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Film } from "lucide-react";
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
import { Seo } from "@/components/seo/seo";
import { generateMovieSchema } from "@/components/seo/schema-markup";
import z from "zod";

const movieDetailsSearchSchema = z.object({
  tab: z.enum(["details", "cast", "crew"]).catch("details").default("details"),
});

export const Route = createFileRoute("/movies/$movieId/")({
  validateSearch: movieDetailsSearchSchema,
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
  const { data: movie } = useSuspenseQuery(movieDetailsQuery(movieId));
  const { data: similar } = useSuspenseQuery(similarMoviesQuery(movieId));

  const movieImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : undefined;

  return (
    <>
      <Seo
        title={`${movie.title} (${new Date(movie.release_date).getFullYear()})`}
        description={movie.overview?.slice(0, 160)}
        image={movieImage}
        type="movie"
        schemaMarkup={generateMovieSchema(movie)}
      />
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
            {similar.results.length > 0 ? (
              <MovieSwiper movies={similar.results} />
            ) : (
              <div className="similar-movies-empty">
                <Film size={48} />
                <p className="text-secondary">Aucun film similaire trouvé.</p>
              </div>
            )}
          </Suspense>
        </section>
      </main>
    </>
  );
}
