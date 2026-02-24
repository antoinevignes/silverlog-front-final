import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import type { MovieType } from "@/utils/types/movie";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Star } from "lucide-react";
import "./diary-mobile.scss";
import { format } from "date-fns";
import Badge from "@/components/ui/badge";

export default function DiaryMobile({ movies }: { movies: MovieType[] }) {
  return (
    <section className="diary-mobile">
      <ul className="diary-list">
        {movies.map((movie) => (
          <li key={movie.id} className="diary-item">
            <Link
              to={`/movies/$movieId`}
              params={{ movieId: String(movie.id) }}
              className="diary-link"
            >
              <figure className="poster-container">
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

                <time
                  dateTime={format(movie.seen_at, "yyyy-MM-dd")}
                  className="day-overlay"
                >
                  {format(movie.seen_at, "d")}
                </time>
              </figure>
              <section className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>

                <div className="movie-meta">
                  {movie.release_date && (
                    <span className="release-year">
                      {format(new Date(movie.release_date), "yyyy")}
                    </span>
                  )}

                  {movie.personal_rating && (
                    <Badge variant="outline" className="tmdb-rating">
                      <Star size={14} fill="#F2C265" stroke="#F2C265" />
                      {(movie.personal_rating / 2).toFixed(1)}
                    </Badge>
                  )}
                </div>
              </section>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
