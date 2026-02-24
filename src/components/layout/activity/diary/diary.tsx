import { format } from "date-fns";
import DiarySkeleton from "./diary-skeleton/diary-skeleton";
import { fr } from "date-fns/locale";
import DiaryMobile from "./diary-mobile/diary-mobile";
import DiaryDesktop from "./diary-desktop/diary-desktop";
import "./diary.scss";
import { useQueries, useQuery } from "@tanstack/react-query";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import { useAuth } from "@/auth";
import type { MovieType } from "@/utils/types/movie";
import { useMemo } from "react";

type JournalItem = {
  movie_id: number;
  seen_at: string;
  rating: number;
};

export default function Diary() {
  const { user } = useAuth();
  const { data: journalItems, isLoading: isLoadingJournal } = useQuery(
    seenMoviesQuery(user!.id),
  );

  const journalMoviesDetailsResults = useQueries({
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
      journalMoviesDetailsResults
        .map((r) => r.data)
        .filter(Boolean) as MovieType[]
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
  }, [journalMoviesDetailsResults]);

  return (
    <main className="container diary-page">
      {isLoadingJournal ? (
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
