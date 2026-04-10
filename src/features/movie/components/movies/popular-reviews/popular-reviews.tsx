import { useSuspenseQuery } from "@tanstack/react-query";
import { popularReviewsQuery } from "@/features/review/api/review.query";
import "./popular-reviews.scss";
import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/avatar/avatar";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { Heart, MessageSquareOff } from "lucide-react";

type PopularReviewsProps = {
  limit?: number;
};

export default function PopularReviews({ limit = 8 }: PopularReviewsProps) {
  const { data: reviews } = useSuspenseQuery(popularReviewsQuery(limit));

  if (!reviews || reviews.length === 0) {
    return (
      <div className="popular-reviews-empty gap-md">
        <MessageSquareOff size={48} />
        <p className="text-secondary">Aucun commentaire pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="reviews-grid gap-md">
      {reviews.map((review) => (
        <article className="review-card p-md gap-sm">
          <div className="review-card-header">
            <Link
              to="/user/$userId"
              params={{ userId: review.user_id }}
              className="review-user gap-sm"
            >
              <Avatar
                username={review.username}
                src={review.avatar_path}
                size="sm"
              />
              <span className="review-username">{review.username}</span>
            </Link>

            {review.rating && (
              <div className="review-rating gap-xs">
                <span className="rating-value">{review.rating / 2}</span>
                <span className="rating-max">/10</span>
              </div>
            )}
          </div>

          <p className="review-content">{review.content}</p>

          <div className="review-card-footer pt-sm">
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(review.movie_id) }}
              className="review-movie gap-sm"
            >
              {review.movie_poster_path && (
                <Image
                  src={getCloudinarySrc(review.movie_poster_path, "posters")}
                  width={32}
                  height={48}
                  layout="constrained"
                  alt={review.movie_title}
                  className="review-movie-poster"
                />
              )}
              <span className="review-movie-title">{review.movie_title}</span>
            </Link>

            <div className="review-likes gap-xs">
              <Heart size={14} fill="currentColor" />
              <span>{review.like_count}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
