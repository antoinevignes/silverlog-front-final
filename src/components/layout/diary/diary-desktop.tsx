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
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";

export default function DiaryDesktop({
  monthDate,
  movies,
}: {
  monthDate: Date;
  movies: any[];
}) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [monthDate]);

  return (
    <section className="month-grid-section">
      <h2 className="month-title">
        {format(monthDate, "MMMM yyyy", { locale: fr })}
      </h2>

      <div className="calendar-grid">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="weekday-label">
            {d}
          </div>
        ))}

        {days.map((day) => {
          const moviesThisDay = movies.filter((m) =>
            isSameDay(new Date(m.seen_at), day),
          );
          const isCurrentMonth = isSameMonth(day, monthDate);
          const hasMovies = moviesThisDay.length > 0;

          return (
            <div
              key={day.toString()}
              className={`calendar-day ${!isCurrentMonth ? "outside" : ""} ${hasMovies ? "has-movies" : "is-empty"}`}
            >
              {isCurrentMonth && !hasMovies && (
                <span className="day-number">{format(day, "d")}</span>
              )}

              {moviesThisDay.map((movie) => (
                <Link
                  key={`${movie.id}-${movie.seen_at}`}
                  to={`/movies/$movieId`}
                  params={{ movieId: String(movie.id) }}
                  className="poster-link"
                >
                  <Image
                    src={getCloudinarySrc(movie.poster_path, "posters")}
                    layout="fullWidth"
                    aspectRatio={2 / 3}
                    alt={movie.title}
                    background={getCloudinaryPlaceholder(
                      movie.poster_path,
                      "posters",
                    )}
                    priority
                    className="poster"
                  />
                  <div className="day-overlay">
                    <span className="number">{format(day, "d")}</span>
                  </div>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
