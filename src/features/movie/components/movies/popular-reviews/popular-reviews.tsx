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
      <div className="popular-reviews-empty">
        <MessageSquareOff size={48} />
        <p className="text-secondary">Aucun commentaire pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="reviews-grid">
      {reviews.map((review) => (
        <article className="review-card">
          <div className="review-card-header">
            <Link
              to="/user/$userId"
              params={{ userId: review.user_id }}
              className="review-user"
            >
              <Avatar
                username={review.username}
                src={review.avatar_path}
                size="sm"
              />
              <span className="review-username">{review.username}</span>
            </Link>

            {review.rating && (
              <div className="review-rating">
                <span className="rating-value">{review.rating / 2}</span>
                <span className="rating-max">/10</span>
              </div>
            )}
          </div>

          <p className="review-content">{review.content}</p>

          <div className="review-card-footer">
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(review.movie_id) }}
              className="review-movie"
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

            <div className="review-likes">
              <Heart size={14} fill="currentColor" />
              <span>{review.like_count}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
