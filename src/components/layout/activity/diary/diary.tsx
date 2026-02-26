import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DiaryMobile from "./diary-mobile/diary-mobile";
import DiaryDesktop from "./diary-desktop/diary-desktop";
import "./diary.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { MovieType } from "@/utils/types/movie";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import { useAuth } from "@/auth";
import { useMemo } from "react";

interface DiaryGroup {
  id: string;
  label: string;
  date: Date;
  movies: Array<MovieType>;
}

export default function Diary() {
  const { user } = useAuth();
  const { data: rawMovies } = useSuspenseQuery(seenMoviesQuery(user!.id));

  const groups = useMemo(() => {
    const movies = [...rawMovies].sort(
      (a: MovieType, b: MovieType) =>
        new Date(b.seen_at).getTime() - new Date(a.seen_at).getTime(),
    );

    const map = movies.reduce(
      (acc: Record<string, DiaryGroup>, movie: MovieType) => {
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
      {} as Record<string, DiaryGroup>,
    );

    return Object.values(map);
  }, [rawMovies]);

  return (
    <main className="container diary-page">
      <div className="diary-layout">
        <section className="diary-content">
          {groups.map((group: DiaryGroup) => (
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
                  {groups.map((group: DiaryGroup) => (
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
    </main>
  );
}
