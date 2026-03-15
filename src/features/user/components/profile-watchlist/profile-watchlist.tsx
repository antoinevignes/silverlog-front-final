import type { MovieType } from "@/features/movie/types/movie";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import "./watchlist.scss";
import { useAuth } from "@/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listDataQuery } from "@/features/list/api/list.queries";

export default function Watchlist() {
  const { user } = useAuth();
  const { data: listData } = useSuspenseQuery(
    listDataQuery(user!.watchlist_id),
  );

  const movies = listData.movies;

  return (
    <section className="content-section" aria-label="Watchlist">
      <div className="watchlist-grid">
        {movies.map((movie: MovieType) => (
          <MovieCard key={movie.id} movie={movie} size="sm" />
        ))}
      </div>
    </section>
  );
}
