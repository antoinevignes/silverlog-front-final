import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CalendarX } from "lucide-react";
import { Link } from "@tanstack/react-router";
import DiaryMobile from "./diary-mobile/diary-mobile";
import DiaryDesktop from "./diary-desktop/diary-desktop";
import "./diary.scss";
import type { MovieType } from "@/features/movie/types/movie";
import { seenMoviesQuery } from "@/features/user/api/user-movie.queries";
import { useAuth } from "@/auth";

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
        if (!(key in acc)) {
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

    return Object.values(map) as Array<DiaryGroup>;
  }, [rawMovies]);

  return (
    <main className="container diary-page">
      <div className="diary-layout gap-lg">
        <section className="diary-content">
          {groups.length === 0 ? (
            <div className="diary-empty-state gap-md">
              <CalendarX size={48} />
              <p className="text-secondary">Votre journal est vide.</p>
              <Link to="/discover" className="discover-link">
                Ajoutez votre premier film
              </Link>
            </div>
          ) : (
            groups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="diary-month-wrapper mb-lg"
              >
                <header className="month-header mb-md pb-sm">
                  <h2>
                    <time dateTime={format(group.date, "yyyy-MM")}>
                      {format(group.date, "MMMM yyyy", { locale: fr })}
                    </time>
                  </h2>
                </header>

                <DiaryMobile movies={group.movies} />
                <DiaryDesktop monthDate={group.date} movies={group.movies} />
              </section>
            ))
          )}
        </section>

        {groups.length > 0 && (
          <aside className="diary-sidebar gap-lg mt-2xl">
            <section className="sidebar-card timeline-card px-sm mb-lg">
              <h3 className="mb-lg pb-md">Chronologie</h3>
              <nav className="timeline-nav">
                <ul className="gap-sm pl-md ml-sm">
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
    </main>
  );
}
