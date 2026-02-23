import type { MovieType } from "@/utils/types/movie";
import "./movie-card.scss";
import { Link } from "@tanstack/react-router";
import { Film } from "lucide-react";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";

type MovieCardSize = "sm" | "md" | "lg";

export default function MovieCard({
  movie,
  size = "md",
}: {
  movie: MovieType;
  size?: MovieCardSize;
}) {
  const posterSrc = getCloudinarySrc(movie?.poster_path, "posters");

  return (
    <Link
      to={`/movies/$movieId`}
      params={{ movieId: String(movie.id) }}
      className={`movie-card movie-card--${size}`}
    >
      {!movie.poster_path ? (
        <div className="poster-fallback">
          <Film size={32} aria-hidden color="#262626" />
        </div>
      ) : (
        <Image
          src={posterSrc}
          layout="fullWidth"
          alt={movie.title}
          background={getCloudinaryPlaceholder(movie.poster_path, "posters")}
          className="movie-card-poster"
        />
      )}
      <p className="movie-title" aria-hidden>
        {movie.title}
      </p>
    </Link>
  );
}
