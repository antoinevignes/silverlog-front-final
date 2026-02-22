import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import type { MovieType } from "@/utils/types/movie";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Star } from "lucide-react";
import "./diary-mobile.scss";

export default function DiaryMobile({
  month,
  movies,
}: {
  month: string;
  movies: MovieType[];
}) {
  return (
    <section key={month} className="diary-mobile">
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
  );
}
