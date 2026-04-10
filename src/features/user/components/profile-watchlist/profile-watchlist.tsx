import type { MovieType } from "@/features/movie/types/movie";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import "./profile-watchlist.scss";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listDataQuery } from "@/features/list/api/list.queries";
import { userQuery } from "@/features/user/api/user.queries";

export default function Watchlist() {
  const routeApi = getRouteApi("/user/$userId/");
  const { userId } = routeApi.useParams();

  const { data: userData } = useSuspenseQuery(userQuery(userId));

  const { data: listData } = useSuspenseQuery(
    listDataQuery(userData.watchlist_id),
  );

  const movies = listData.movies;

  return (
    <section className="content-section" aria-label="Watchlist">
      <div className="watchlist-grid gap-md mt-md">
        {movies.map((movie: MovieType) => (
          <MovieCard key={movie.id} movie={movie} size="sm" />
        ))}
      </div>
    </section>
  );
}
