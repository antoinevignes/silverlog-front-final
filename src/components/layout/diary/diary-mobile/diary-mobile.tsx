import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import type { MovieType } from "@/utils/types/movie";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Star, StarHalf } from "lucide-react";
import "./diary-mobile.scss";
import { format } from "date-fns";

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

              <div className="movie-info">
                <h3>{movie.title}</h3>

                <p className="year">{format(movie.release_date, "yyyy")}</p>

                {movie.personal_rating && (
                  <div
                    className="rating-section"
                    aria-label={`Note : ${movie.personal_rating / 2} sur 10`}
                  >
                    <div>
                      {Array.from({
                        length: Math.floor(movie.personal_rating / 2),
                      }).map((_, index) => (
                        <Star
                          key={`full-${index}`}
                          size={14}
                          stroke="#F2C265"
                          fill="#F2C265"
                        />
                      ))}
                      {movie.personal_rating % 2 !== 0 && (
                        <StarHalf size={14} stroke="#F2C265" fill="#F2C265" />
                      )}
                    </div>

                    <span className="text-secondary rating-number">
                      ({movie.personal_rating / 2} / 10)
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
