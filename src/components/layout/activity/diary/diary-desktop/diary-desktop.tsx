import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";
import "./diary-desktop.scss";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Plus } from "lucide-react";
import type { MovieType } from "@/utils/types/movie";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

export default function DiaryDesktop({
  monthDate,
  movies,
}: {
  monthDate: Date;
  movies: Array<MovieType>;
}) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [monthDate]);

  return (
    <section className="month-grid-section">
      <ol className="calendar-grid">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <li key={d} className="weekday-label">
            {d}
          </li>
        ))}

        {days.map((day) => {
          const moviesThisDay = movies.filter((m) =>
            isSameDay(new Date(m.seen_at), day),
          );
          const isCurrentMonth = isSameMonth(day, monthDate);
          const hasMovies = moviesThisDay.length > 0;
          const dayFormatted = format(day, "d");

          return (
            <li
              key={day.toString()}
              className={`calendar-day ${!isCurrentMonth ? "outside" : ""} ${hasMovies ? "has-movies" : "is-empty"}`}
            >
              {isCurrentMonth && !hasMovies && (
                <Link
                  to="/"
                  className="add-movie-link"
                  aria-label={`Ajouter un film le ${format(day, "d MMMM yyyy", { locale: fr })}`}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className="day-number"
                  >
                    {dayFormatted}
                  </time>
                  <Plus size={24} className="add-icon" />
                </Link>
              )}

              {moviesThisDay.map((movie) => (
                <Link
                  key={`${movie.id}-${movie.seen_at}`}
                  to={`/movies/$movieId`}
                  params={{ movieId: String(movie.id) }}
                  className="poster-link"
                  aria-label={`${movie.title}, vu le ${format(day, "d MMMM", { locale: fr })}`}
                >
                  <Image
                    src={getCloudinarySrc(movie.poster_path, "posters")}
                    layout="fullWidth"
                    aspectRatio={2 / 3}
                    alt={movie.title}
                    background="auto"
                    priority
                    className="poster-img"
                  />

                  <time
                    dateTime={format(new Date(movie.seen_at), "yyyy-MM-dd")}
                    className="day-overlay"
                  >
                    {format(day, "d")}
                  </time>
                </Link>
              ))}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
