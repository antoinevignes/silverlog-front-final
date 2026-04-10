import Skeleton from "@/components/ui/skeleton/skeleton";
import "./watchlist-skeleton.scss";

export default function WatchlistSkeleton() {
  return (
    <section className="watchlist-skeleton-page container gap-md m-2xl mx-auto">
      <div className="watchlist-skeleton-filters gap-sm">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>

      <div className="watchlist-skeleton-layout gap-md">
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton key={i} width="100%" className="watchlist-skeleton" />
        ))}
      </div>
    </section>
  );
}
