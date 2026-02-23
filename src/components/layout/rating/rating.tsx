import { getRouteApi } from "@tanstack/react-router";
import "./rating.scss";
import { Star } from "lucide-react";
import { useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { movieStateQuery } from "@/queries/user-movie.queries";
import {
  useDeleteMovieRating,
  useUpdateMovieRating,
} from "@/queries/user-movie.mutations";
import { movieReviewQuery } from "@/queries/review.query";
import { useAuth } from "@/auth";
import { toast } from "sonner";

const MAX_STARS = 10;

function StarWrapper({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="star-wrapper" {...props}>
      {children}
    </span>
  );
}

export default function Rating() {
  const { user } = useAuth();
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();

  const {
    data: { rating: initialRating },
  } = useSuspenseQuery(movieStateQuery(movieId));
  const { data: review, isLoading } = useQuery(movieReviewQuery(user, movieId));

  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const getStarValue = (
    index: number,
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;

    return index + (x < width / 2 ? 0.5 : 1);
  };

  const { mutate: updateRating, isPending: isUpdating } =
    useUpdateMovieRating(movieId);
  const { mutate: deleteRating, isPending: isDeleting } =
    useDeleteMovieRating(movieId);

  const rating = initialRating ? initialRating / 2 : 0;
  const displayValue = hoverValue ?? rating;
  const isPending = isUpdating || isDeleting;

  const handleClick = (value: number) => {
    if (isPending || isLoading) return;

    setHoverValue(null);

    if (review && value === rating) {
      toast.error("Vous devez supprimer votre avis avant de supprimer la note");
      return;
    }

    if (value === rating) {
      deleteRating();
    } else {
      updateRating(value);
    }
  };

  return (
    <div className="rating-block">
      <div className="star-container" onMouseLeave={() => setHoverValue(null)}>
        {Array.from({ length: MAX_STARS }).map((_, index) => {
          const starNumber = index + 1;

          const isFull = displayValue >= starNumber;
          const isHalf =
            displayValue >= starNumber - 0.5 && displayValue < starNumber;

          return (
            <StarWrapper
              key={index}
              onMouseMove={(e) =>
                !isPending && setHoverValue(getStarValue(index, e))
              }
              onClick={(e) => handleClick(getStarValue(index, e))}
              style={{
                opacity: isPending ? 0.7 : 1,
              }}
            >
              <Star
                size={24}
                stroke="#737373"
                fill="#737373"
                className="star-background"
              />

              {(isFull || isHalf) && (
                <Star
                  size={24}
                  stroke="#F2C265"
                  fill="#F2C265"
                  className="star-foreground"
                  style={{
                    clipPath: isHalf ? "inset(0 50% 0 0)" : undefined,
                  }}
                />
              )}
            </StarWrapper>
          );
        })}
      </div>

      <span className="rating-status" aria-live="polite">
        {displayValue > 0 ? `Ma note : ${displayValue} / 10` : "Noter ce film"}
      </span>
    </div>
  );
}
