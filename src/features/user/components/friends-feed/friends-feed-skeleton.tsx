import Skeleton from "@/components/ui/skeleton/skeleton";
import "./friends-feed.scss";

export default function FriendsFeedSkeleton() {
  return (
    <div className="activity-feed">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} width={488} height={214} />
      ))}
    </div>
  );
}
