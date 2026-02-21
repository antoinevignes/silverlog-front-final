import { createFileRoute, Link } from "@tanstack/react-router";
import "./diary.scss";
import ArticleTitle from "@/components/layout/section-title/article-title";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import Badge from "@/components/ui/badge";
import {
  LayoutPanelLeft,
  Medal,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import type { MovieType } from "@/utils/types/movie";

type JournalItem = {
  movie_id: number;
  seen_at: string;
  rating: number;
};

export const Route = createFileRoute("/_authenticated/user/$userId/diary/")({
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    queryClient.ensureQueryData(seenMoviesQuery(userId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  const { data: journalItems, isLoading: isLoadingJournal } = useQuery(
    seenMoviesQuery(userId),
  );

  const movieDetailsResults = useQueries({
    queries: (journalItems ?? []).map((item: JournalItem) => ({
      queryKey: ["movie", item.movie_id, "details", item.rating],
      queryFn: async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
        );
        const details = await res.json();

        return {
          ...details,
          seen_at: item.seen_at,
          personal_rating: item.rating,
        };
      },
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });

  const sorted = (
    movieDetailsResults.map((r) => r.data).filter(Boolean) as MovieType[]
  ).sort(
    (a, b) => new Date(b.seen_at).getTime() - new Date(a.seen_at).getTime(),
  );

  const groupedMovies = sorted.reduce(
    (acc, movie: MovieType) => {
      const date = new Date(movie.seen_at);
      const monthYear = date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(movie);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const isLoading =
    isLoadingJournal || movieDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container diary-page">
      <ArticleTitle title="Journal" />

      <section className="filter-badges">
        <Badge>
          <X size={16} />
          <span>Tous ({journalItems?.length})</span>
        </Badge>

        <Badge variant="secondary">
          <SlidersHorizontal size={16} />
          <span>Filtrer</span>
        </Badge>

        <Badge variant="secondary">
          <Medal size={16} />
          <span>Dans mon top</span>
        </Badge>

        <LayoutPanelLeft />
      </section>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        Object.entries(groupedMovies).map(([month, movies]) => (
          <section key={month} className="diary-month-section">
            <h2 className="month-title">{month}</h2>
            <ul className="diary-list">
              {movies.map((movie) => (
                <li key={movie.id} className="diary-item">
                  <Link
                    to={`/movies/$movieId`}
                    params={{ movieId: String(movie.id) }}
                    className="diary-link"
                  >
                    <div className="poster-container">
                      <Image
                        src={getCloudinarySrc(movie.poster_path, "posters")}
                        layout="constrained"
                        width={60}
                        aspectRatio={2 / 3}
                        alt={movie.title}
                        background={getCloudinaryPlaceholder(
                          movie.poster_path,
                          "posters",
                        )}
                        priority
                        className="poster"
                      />

                      <span className="day-badge">
                        {new Date(movie.seen_at).getDate()}
                      </span>
                    </div>

                    <section className="movie-info">
                      <h3>{movie.title}</h3>
                      <p className="year text-secondary">
                        ({movie.release_date.split("-")[0]})
                      </p>

                      {movie.personal_rating && (
                        <section className="rating-section">
                          <div>
                            {Array.from({
                              length: Math.floor(movie.personal_rating / 2),
                            }).map((_, index) => (
                              <Star
                                key={index}
                                size={14}
                                stroke="#F2C265"
                                fill="#F2C265"
                              />
                            ))}
                          </div>

                          <span className="text-secondary rating-number">
                            ({movie.personal_rating / 2} / 10)
                          </span>
                        </section>
                      )}
                    </section>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
