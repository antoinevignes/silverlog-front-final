import Skeleton from "@/components/ui/skeleton/skeleton";
import type { MovieType } from "@/utils/types/movie";
import "./watchlist.scss";
import MovieCard from "../../movie-card/movie-card";

export default function Watchlist({
  isFetchingMovies,
  movies,
}: {
  isFetchingMovies: boolean;
  movies: MovieType[];
}) {
  return (
    <main className="container watchlist-page">
      {isFetchingMovies ? (
        <WatchlistSkeleton />
      ) : movies.length > 0 ? (
        <section className="watchlist-layout">
          {movies.map((movie) => (
            <MovieCard movie={movie} size="sm" />
          ))}
        </section>
      ) : (
        <p className="empty-state">Votre watchlist est vide pour le moment.</p>
      )}
    </main>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="watchlist-layout">
      {Array.from({ length: 40 }).map((_, i) => (
        <Skeleton key={i} width="100%" className="watchlist-skeleton" />
      ))}
    </div>
  );
}
