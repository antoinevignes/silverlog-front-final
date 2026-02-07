import HorizontalScroller from "@/components/layout/horizontal-scroller/horizontal-scroller";
import MovieCard from "@/components/layout/movie-card/movie-card";
import ArticleTitle from "@/components/layout/section-title/article-title";
import { Separator } from "@/components/ui/separator";
import {
  movieCreditsQuery,
  movieDetailsQuery,
  similarMoviesQuery,
} from "@/queries/movie.queries";
import type { MovieType } from "@/utils/types/movie";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import MovieHeader from "./-components/movie-header/movie-header";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { movieStateQuery } from "@/queries/user-movie.queries";

export const Route = createFileRoute("/movies/$movieId/")({
  loader: ({ context: { queryClient }, params: { movieId } }) => {
    queryClient.prefetchQuery(movieDetailsQuery(movieId));
    queryClient.prefetchQuery(movieCreditsQuery(movieId));
    queryClient.prefetchQuery(movieStateQuery(movieId));
    queryClient.prefetchQuery(similarMoviesQuery(movieId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { movieId } = Route.useParams();

  const { data: similar, isLoading } = useQuery(similarMoviesQuery(movieId));

  return (
    <main>
      <MovieHeader />

      <Separator />
      {/* 
      <Critics /> */}

      <Separator />

      <section className="container suggestions">
        <ArticleTitle title="Films similaires" />

        <HorizontalScroller className="movie-scroller">
          {isLoading
            ? Array.from({ length: 9 }).map((_, index) => (
                <li key={`skeleton-${index}`}>
                  <Skeleton width="6.5rem" height="9.75rem" />
                </li>
              ))
            : similar.results.map((movie: MovieType) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} size="sm" />
                </li>
              ))}
        </HorizontalScroller>
      </section>

      <Separator />
    </main>
  );
}
