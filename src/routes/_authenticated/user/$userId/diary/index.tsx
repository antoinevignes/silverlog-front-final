import { createFileRoute } from "@tanstack/react-router";
import "./diary.scss";
import ArticleTitle from "@/components/layout/section-title/article-title";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { MovieType } from "@/utils/types/movie";

import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DiaryMobile from "@/components/layout/diary/diary-mobile/diary-mobile";
import DiaryDesktop from "@/components/layout/diary/diary-desktop/diary-desktop";
import DiarySkeleton from "@/components/layout/diary/diary-skeleton/diary-skeleton";

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

  const groups = useMemo(() => {
    const movies = (
      movieDetailsResults.map((r) => r.data).filter(Boolean) as MovieType[]
    ).sort(
      (a, b) => new Date(b.seen_at).getTime() - new Date(a.seen_at).getTime(),
    );

    const map = movies.reduce(
      (acc, movie) => {
        const date = new Date(movie.seen_at);
        const key = format(date, "yyyy-MM");
        if (!acc[key]) {
          acc[key] = {
            id: key,
            label: format(date, "MMMM yyyy", { locale: fr }),
            date: date,
            movies: [],
          };
        }
        acc[key].movies.push(movie);
        return acc;
      },
      {} as Record<
        string,
        { id: string; label: string; date: Date; movies: MovieType[] }
      >,
    );

    return Object.values(map);
  }, [movieDetailsResults]);

  const isLoading =
    isLoadingJournal || movieDetailsResults.some((r) => r.isLoading);

  const totalMovies = groups.reduce((acc, g) => acc + g.movies.length, 0);
  const averageRating =
    groups.length > 0
      ? (
          groups.reduce(
            (acc, g) =>
              acc +
              g.movies.reduce((sum, m) => sum + (m.personal_rating || 0), 0),
            0,
          ) / totalMovies || 0
        ).toFixed(1)
      : null;

  return (
    <main className="container diary-page">
      <ArticleTitle title="Journal" />

      {isLoading ? (
        <DiarySkeleton />
      ) : (
        <div className="diary-layout">
          <section className="diary-content">
            {groups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="diary-month-wrapper"
              >
                <header className="month-header">
                  <h2>
                    <time dateTime={format(group.date, "yyyy-MM")}>
                      {format(group.date, "MMMM yyyy", { locale: fr })}
                    </time>
                  </h2>
                </header>

                <DiaryMobile movies={group.movies} />
                <DiaryDesktop monthDate={group.date} movies={group.movies} />
              </section>
            ))}
          </section>

          {groups.length > 0 && (
            <aside className="diary-sidebar">
              <section className="sidebar-card stats-card">
                <h3>Statistiques</h3>
                <ul>
                  <li>
                    <span className="stat-label">Films vus</span>
                    <span className="stat-value">{totalMovies}</span>
                  </li>
                  {averageRating && (
                    <li>
                      <span className="stat-label">Note moyenne</span>
                      <span className="stat-value">
                        {Number(averageRating) / 2} / 10
                      </span>
                    </li>
                  )}
                </ul>
              </section>

              <section className="sidebar-card timeline-card">
                <h3>Chronologie</h3>
                <nav className="timeline-nav">
                  <ul>
                    {groups.map((group) => (
                      <li key={`nav-${group.id}`}>
                        <a href={`#${group.id}`}>
                          {format(group.date, "MMMM yyyy", { locale: fr })}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>
            </aside>
          )}
        </div>
      )}
    </main>
  );
}
