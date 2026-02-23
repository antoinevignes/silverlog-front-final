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
import "./top-list.scss";

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
  const { data, isLoading: isLoadingList } = useQuery(
    listDataQuery(user!.top_list_id!),
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

  const isFetchingMovies =
    isLoadingList || movieDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container top-list-page">
      <ArticleTitle title="Mon Top 50" />

      {isFetchingMovies ? (
        <div className="top-list-layout">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Skeleton width="100%" height="100%" />
              </div>
              <Skeleton width={80} height={120} />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={16} />
              </div>
            </div>
          ))}
        </div>
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
        <p className="empty-state">Votre Top 50 est vide pour le moment.</p>
      )}
    </main>
  );
}
