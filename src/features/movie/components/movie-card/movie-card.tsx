import { Image } from "@unpic/react";
import { Film, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { MovieType } from "@/features/movie/types/movie";
import "./movie-card.scss";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

type MovieCardSize = "sm" | "md" | "lg";

export default function MovieCard({
  movie,
  size = "md",
  onRemove,
}: {
  movie: MovieType;
  size?: MovieCardSize;
  onRemove?: () => void;
}) {
  const posterSrc = getCloudinarySrc(movie.poster_path, "posters");

  return (
    <Link
      to={`/movies/$movieId`}
      params={{ movieId: String(movie.id) }}
      className={`movie-card movie-card--${size}`}
    >
      {!movie.poster_path ? (
        <div className="poster-fallback">
          <Film size={32} aria-hidden color="currentColor" />
        </div>
      ) : (
        <Image
          src={posterSrc}
          layout="constrained"
          width={size === "sm" ? 104 : size === "md" ? 136 : 192}
          aspectRatio={2 / 3}
          alt={`Affiche du film ${movie.title}`}
          background="auto"
          loading="lazy"
          decoding="async"
          className="movie-card-poster"
        />
      )}
      {onRemove && (
        <button
          className="remove-movie-button"
          aria-label="Retirer de la liste"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          <X size={14} />
        </button>
      )}
      <p className="movie-title" aria-hidden>
        {movie.title}
      </p>
    </Link>
  );
}
