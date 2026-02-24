import { useAuth } from "@/auth";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { listDataQuery } from "@/queries/list.queries";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import type { MovieType } from "@/utils/types/movie";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { format } from "date-fns";
import { Star } from "lucide-react";
import "./top-list.scss";
import Badge from "@/components/ui/badge/badge";

export const Route = createFileRoute("/_authenticated/user/$userId/top/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(
      listDataQuery(context.auth.user!.top_list_id!),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const { data: topListData, isLoading: isLoadingTopList } = useQuery(
    listDataQuery(user!.top_list_id!),
  );

  const topListMoviesDetailsResults = useQueries({
    queries: (topListData ?? []).map((item: any) => ({
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

  const movies = topListMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const isFetchingMovies =
    isLoadingTopList || topListMoviesDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container top-list-page">
      {isFetchingMovies ? (
        <TopListSkeleton />
      ) : movies.length > 0 ? (
        <section className="top-list-layout">
          {movies.map((movie, index) => (
            <Link
              to={`/movies/$movieId`}
              params={{ movieId: String(movie.id) }}
              className="top-list-list-item"
              key={movie.id}
            >
              <div className="rank-display">
                <span className="rank-number">{index + 1}</span>
              </div>

              <figure className="poster-container">
                <Image
                  src={getCloudinarySrc(movie.poster_path, "posters")}
                  layout="constrained"
                  width={80}
                  aspectRatio={2 / 3}
                  alt={movie.title}
                  background={getCloudinaryPlaceholder(
                    movie.poster_path,
                    "posters",
                  )}
                  className="poster"
                />
              </figure>

              <section className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>

                <div className="movie-meta">
                  {movie.release_date && (
                    <span className="release-year">
                      {format(new Date(movie.release_date), "yyyy")}
                    </span>
                  )}

                  {(movie as any).vote_average > 0 && (
                    <Badge variant="outline" className="tmdb-rating">
                      <Star size={14} fill="#F2C265" stroke="#F2C265" />
                      {(movie as any).vote_average.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </section>
            </Link>
          ))}
        </section>
      ) : (
        <p className="empty-state">Votre Top 50 est vide pour le moment.</p>
      )}
    </main>
  );
}

function TopListSkeleton() {
  return (
    <div className="top-list-layout">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} width="100%" className="top-list-skeleton" />
      ))}
    </div>
  );
}
