import "./reviews.scss";
import { ArrowRight, Heart } from "lucide-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import {
  Card,
  CardFooter,
  CardHeader,
  CardRating,
  CardTitle,
  CardTitleRow,
} from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { movieReviewsQuery } from "@/queries/review.query";
import { useLikeReview } from "@/queries/review.mutations";

type ReviewType = {
  id: string;
  username: string;
  rating: number;
  content: string;
  is_liked_by_user: boolean;
  like_count: number;
  created_at: string;
};

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

      <ul className="review-list">
        {reviews.map((review: ReviewType) => (
          <li key={review.id}>
            <Card>
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
                      fill={review.is_liked_by_user ? "red" : "none"}
                      stroke={review.is_liked_by_user ? "red" : "black"}
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

      {reviews && reviews.length > 0 && (
        <Link to="/" className="underline-link see-more">
          Toutes les critiques
          <ArrowRight size={16} />
        </Link>
      )}
    </>
  );
}
