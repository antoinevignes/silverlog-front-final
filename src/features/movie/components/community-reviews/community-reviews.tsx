import { Card } from "@/components/ui/card/card";
import { recentReviewsQuery } from "@/features/review/api/review.query";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { Star } from "lucide-react";
import "./community-reviews.scss";

export default function CommunityReviews() {
  const { data: recentReviews } = useSuspenseQuery(recentReviewsQuery());
  return (
    <div className="community-reviews-grid">
      {recentReviews && recentReviews.length > 0 ? (
        recentReviews.map((review: any) => (
          <Card key={review.id} className="community-review-card">
            <div className="review-poster">
              <Image
                src={getCloudinarySrc(review.movie_poster_path, "posters")}
                background="auto"
                layout="constrained"
                width={100}
                height={150}
                alt={`Affiche du film ${review.title}`}
              />
            </div>

            <div className="review-content">
              <header className="review-header">
                <span className="review-user">{review.username}</span>

                <span className="review-action">
                  a noté <strong>{review.title}</strong>
                </span>

                <div className="review-stars">
                  <Star size={14} fill="currentColor" />
                  {review.rating / 2} / 10{" "}
                </div>
              </header>

              <p className="review-text">"{review.content}"</p>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-secondary text-center">Aucune critique récente.</p>
      )}
    </div>
  );
}
