import Skeleton from "@/components/ui/skeleton/skeleton";
import type { MovieType } from "@/utils/types/movie";
import "./watchlist.scss";
import MovieCard from "../../movie-card/movie-card";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { listDataQuery } from "@/queries/list.queries";

export default function Watchlist() {
  const { user } = useAuth();
  const { data: watchlistData, isLoading: isLoadingWatchlist } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );

  const watchlistMoviesDetailsResults = useQueries({
    queries: (watchlistData ?? []).map((item: any) => ({
      queryKey: ["movie", item.movie_id, "details", item.added_at],
      queryFn: async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
        );
        const details = await res.json();

        return details;
      },
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });

  const movies = watchlistMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const isFetchingMovies =
    isLoadingWatchlist ||
    watchlistMoviesDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container watchlist-page">
      {isFetchingMovies ? (
        <WatchlistSkeleton />
      ) : movies.length > 0 ? (
        <section className="watchlist-layout">
          {movies.map((movie) => (
            <MovieCard movie={movie} size="sm" key={movie.id} />
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
