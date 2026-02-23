import { useMemo } from "react";
import { useAuth } from "@/auth";
import { listDataQuery } from "@/queries/list.queries";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import ArticleTitle from "@/components/layout/section-title/article-title";
import type { MovieType } from "@/utils/types/movie";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { Image } from "@unpic/react";
import {
  getCloudinarySrc,
  getCloudinaryPlaceholder,
} from "@/utils/cloudinary-handler";
import "./watchlist.scss";

export const Route = createFileRoute("/_authenticated/user/$userId/watchlist/")(
  {
    loader: ({ context }) => {
      context.queryClient.ensureQueryData(
        listDataQuery(context.auth.user!.watchlist_id!),
      );
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { user } = useAuth();
  const { data, isLoading: isLoadingList } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );

  const movieDetailsResults = useQueries({
    queries: (data ?? []).map((item: any) => ({
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

  const movies = movieDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const { totalRuntime, averageRating } = useMemo(() => {
    if (!movies.length) return { totalRuntime: 0, averageRating: 0 };

    let runtime = 0;
    let totalRating = 0;
    let ratingCount = 0;

    for (const movie of movies) {
      if ((movie as any).runtime) runtime += (movie as any).runtime;
      if ((movie as any).vote_average) {
        totalRating += (movie as any).vote_average;
        ratingCount++;
      }
    }

    return {
      totalRuntime: runtime,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
    };
  }, [movies]);

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "0h";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const isFetchingMovies =
    isLoadingList || movieDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container watchlist-page">
      <ArticleTitle title="Ma Watchlist" />

      <section className="watchlist-stats">
        <div className="stat-card">
          <span className="stat-value">
            {isLoadingList ? "-" : movies.length}
          </span>
          <span className="stat-label">Films à voir</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {isLoadingList ? "-" : formatRuntime(totalRuntime)}
          </span>
          <span className="stat-label">Temps estimé</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {isLoadingList
              ? "-"
              : averageRating > 0
                ? `${averageRating.toFixed(1)} / 10`
                : "-"}
          </span>
          <span className="stat-label">Note moyenne TMDB</span>
        </div>
      </section>

      {isFetchingMovies ? (
        <div className="watchlist-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={260} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <section className="watchlist-grid">
          {movies.map((movie) => (
            <Link
              to={`/movies/$movieId`}
              params={{ movieId: String(movie.id) }}
              className="watchlist-movie-card"
              key={movie.id}
            >
              <figure className="poster-container">
                <Image
                  src={getCloudinarySrc(movie.poster_path, "posters")}
                  layout="fullWidth"
                  aspectRatio={2 / 3}
                  alt={movie.title}
                  background={getCloudinaryPlaceholder(
                    movie.poster_path,
                    "posters",
                  )}
                  className="poster"
                />
              </figure>

              <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                  {movie.release_date && (
                    <span className="release-year">
                      {format(new Date(movie.release_date), "yyyy")}
                    </span>
                  )}
                  {(movie as any).vote_average > 0 && (
                    <span className="tmdb-rating">
                      <Star size={14} fill="#F2C265" stroke="#F2C265" />
                      {(movie as any).vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <p className="empty-state">Votre watchlist est vide pour le moment.</p>
      )}
    </main>
  );
}
