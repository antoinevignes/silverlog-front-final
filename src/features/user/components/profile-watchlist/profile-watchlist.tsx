import type { MovieType } from "@/features/movie/types/movie";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import "./profile-watchlist.scss";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listDataQuery } from "@/features/list/api/list.queries";
import { userQuery } from "@/features/user/api/user.queries";
import { useAuth } from "@/auth";
import { BookmarkPlus } from "lucide-react";

export default function Watchlist() {
  const routeApi = getRouteApi("/user/$userId/");
  const { userId } = routeApi.useParams();
  const { user } = useAuth();

  const { data: userData } = useSuspenseQuery(userQuery(userId));

  const { data: listData } = useSuspenseQuery(
    listDataQuery(userData.watchlist_id),
  );

  const movies = listData.movies;
  const isOwner = Number(user?.id) === Number(userId);

  return (
    <section className="content-section" aria-label="Watchlist">
      {movies.length === 0 ? (
        <div className="profile-watchlist-empty">
          <BookmarkPlus size={48} />
          <p className="text-secondary">
            {isOwner
              ? "Votre watchlist est vide."
              : "Cette watchlist est vide."}
          </p>
          {isOwner && (
            <Link to="/discover" className="discover-link">
              Commencez à chercher des films
            </Link>
          )}
        </div>
      ) : (
        <div className="watchlist-grid gap-md mt-md">
          {movies.map((movie: MovieType) => (
            <MovieCard key={movie.id} movie={movie} size="sm" />
          ))}
        </div>
      )}
    </section>
  );
}
