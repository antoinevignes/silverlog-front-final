import type { MovieType } from "@/utils/types/movie";
import "./movie-card.scss";
import { Link } from "@tanstack/react-router";
import { Film } from "lucide-react";

type MovieCardSize = "sm" | "md" | "lg";

export default function MovieCard({
  movie,
  size = "md",
}: {
  movie: MovieType;
  size?: MovieCardSize;
}) {
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
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={`Poster du film ${movie.title}`}
        />
      )}
      <p className="movie-title" aria-hidden>
        {movie.title}
      </p>
    </Link>
  );
}
