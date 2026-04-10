import Skeleton from "@/components/ui/skeleton/skeleton";
import "./popular-reviews.scss";

export default function PopularReviewsSkeleton() {
  return (
    <div className="reviews-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} width="100%" height="10.25rem" />
      ))}
    </div>
  );
}
