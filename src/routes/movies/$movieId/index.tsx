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
// import Critics from "./-components/reviews/reviews";
// import { Separator } from "@/components/ui/separator";
// import ArticleTitle from "@/components/layout/section-title/article-title";
// import HorizontalScroller from "@/components/layout/horizontal-scroller/horizontal-scroller";
// import MovieCard from "@/components/layout/movie-card/movie-card";
// import type { MovieType } from "@/utils/types/movie";
// import { useQuery } from "@tanstack/react-query";
// import {
//   movieCreditsQuery,
//   movieDetailsQuery,
//   movieStateQuery,
//   similarMoviesQuery,
// } from "@/queries/movie.queries";
// import MovieHeader from "./-components/movie-header/movie-header";

export const Route = createFileRoute("/movies/$movieId/")({
  loader: async ({ context: { queryClient }, params: { movieId } }) => {
    await Promise.all([
      queryClient.ensureQueryData(movieDetailsQuery(movieId)),
      queryClient.ensureQueryData(movieCreditsQuery(movieId)),
      //       queryClient.ensureQueryData(movieStateQuery(movieId)),
      queryClient.prefetchQuery(similarMoviesQuery(movieId)),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { movieId } = Route.useParams();

  const { data: similar, isLoading } = useQuery(similarMoviesQuery(movieId));

  return (
    <main>
      {/* <MovieHeader />

      <Separator />

      <Critics />

      <Separator /> */}

      <section className="container suggestions">
        <ArticleTitle title="Films similaires" />

        <HorizontalScroller className="movie-scroller">
          {!similar && isLoading && "Chargement..."}
          {!isLoading &&
            similar.results.map((movie: MovieType) => (
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
