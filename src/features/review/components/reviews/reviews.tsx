import "./reviews.scss";
import { Heart } from "lucide-react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardFooter,
  CardHeader,
  CardRating,
  CardTitle,
  CardTitleRow,
} from "@/components/ui/card/card";
import { movieReviewsQuery } from "@/features/review/api/review.query";
import { useLikeReview } from "@/features/review/api/review.mutations";

export default function Reviews() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();

  const { data: reviews } = useSuspenseQuery(movieReviewsQuery(movieId));
  const { mutate: likeReview, isPending } = useLikeReview(movieId);

  return (
    <>
      {(!reviews || reviews.length === 0) && (
        <p className="text-secondary">
          Aucune critique pour ce film. Soyez le premier!
        </p>
      )}

      <ul className="review-list gap-md">
        {reviews.map((review: any) => (
          <li key={review.id}>
            <Card className="review-card">
              <CardHeader>
                <CardTitleRow>
                  <CardTitle>{review.username}</CardTitle>
                  <CardRating>({review.rating / 2} / 10)</CardRating>
                </CardTitleRow>
              </CardHeader>

              <p>{review.content}</p>

              <CardFooter className="review-footer">
                <section className="review-actions">
                  <button
                    className="like-button"
                    onClick={() => likeReview(review.id)}
                    disabled={isPending}
                  >
                    <Heart
                      size={16}
                      aria-hidden
                      fill={review.is_liked_by_user ? "#ef4444" : "none"}
                      stroke={
                        review.is_liked_by_user ? "#ef4444" : "currentColor"
                      }
                    />
                    {review.like_count}
                  </button>
                </section>

                <p>
                  Publié le {new Date(review.created_at).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
