import Skeleton from "@/components/ui/skeleton/skeleton";

export default function CommunityReviewsSkeleton() {
  return (
    <div className="community-reviews-grid">
      <Skeleton width="100%" height={124} />
      <Skeleton width="100%" height={124} />
    </div>
  );
}
