import Badge from "@/components/ui/badge/badge";
import type { MovieType } from "@/features/movie/types/movie";
import { Star } from "lucide-react";
import "./rating-badge.scss";

export default function RatingBadge({
  movie,
  voteAvg,
  voteCount,
  className,
}: {
  movie: MovieType;
  voteAvg: number;
  voteCount: number;
  className?: string;
}) {
  return (
    <Badge
      className={`grade ${className || ""}`}
      aria-label={`Note de ${movie.vote_average} sur 10`}
    >
      <Star className="star-icon" aria-hidden color="#F1DA51" fill="#F1DA51" />

      <strong className="rating">
        <data value={movie.vote_average}>{Math.round(voteAvg * 10) / 10}</data>
        /10
      </strong>

      <span className="text-secondary rating-count">
        ({voteCount.toLocaleString()})
      </span>
    </Badge>
  );
}
