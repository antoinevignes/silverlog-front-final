import Skeleton from "@/components/ui/skeleton/skeleton";
import "./watchlist-skeleton.scss";

export default function WatchlistSkeleton() {
  return (
    <section className="watchlist-skeleton-page container">
      <div className="watchlist-skeleton-filters">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>

      <div className="watchlist-skeleton-layout">
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton key={i} width="100%" className="watchlist-skeleton" />
        ))}
      </div>
    </section>
  );
}
