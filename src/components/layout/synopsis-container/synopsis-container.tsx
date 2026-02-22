import "./synopsis-container.scss";
import Badge from "@/components/ui/badge";
import type { MovieType } from "@/utils/types/movie";
import { useState } from "react";

export default function SynopsisContainer({
  movie,
  className,
}: {
  movie: MovieType;
  className: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const overviewPreviewLength = className === "synopsis-desktop" ? 300 : 150;
  const shouldShowReadMore =
    movie.overview.length > overviewPreviewLength && !isExpanded;

  return (
    <section className={`synopsis ${className}`}>
      {movie.tagline && (
        <p className="tagline text-secondary">"{movie.tagline}"</p>
      )}

      <p className={isExpanded ? "overview-expanded" : "overview-preview"}>
        {isExpanded
          ? movie.overview
          : shouldShowReadMore
            ? `${movie.overview.substring(0, overviewPreviewLength)}...`
            : movie.overview}
      </p>

      {shouldShowReadMore && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(true)}
          aria-expanded={isExpanded}
        >
          Voir plus
        </button>
      )}

      {isExpanded && movie.overview.length > overviewPreviewLength && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(false)}
          aria-expanded={isExpanded}
        >
          Voir moins
        </button>
      )}

      <ul className="genre-badges">
        {movie.genres.map((genre: { name: string }) => (
          <li key={genre.name}>
            <Badge variant="outline">{genre.name}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
