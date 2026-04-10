import Skeleton from "@/components/ui/skeleton/skeleton";
import "./list-skeleton.scss";

export default function ListSkeleton() {
  return (
    <main className="list-skeleton-page container m-2xl mx-auto">
      {/* Title */}
      <div className="skeleton-title mb-md">
        <Skeleton width="60%" height={32} />
      </div>

      {/* Backdrop */}
      <Skeleton width="100%" className="skeleton-backdrop mb-lg" />

      {/* Author Section */}
      <section className="skeleton-author-section mb-lg">
        <div className="author-info gap-sm">
          <Skeleton width={44} height={44} variant="circle" />
          <div className="author-details gap-xs">
            <Skeleton width={120} height={20} />
            <Skeleton width={150} height={16} />
          </div>
        </div>
        <Skeleton width={24} height={24} />
      </section>

      {/* Description */}
      <section className="skeleton-description mb-lg">
        <Skeleton width="100%" height={16} className="skeleton-desc-line mb-xs" />
        <Skeleton width="100%" height={16} className="skeleton-desc-line mb-xs" />
        <Skeleton width="80%" height={16} />
        <div className="skeleton-desc-button mt-sm">
          <Skeleton width={30} height={16} />
        </div>
      </section>

      {/* Stats */}
      <section className="skeleton-stats mb-lg">
        <div className="skeleton-stats-row gap-md">
          <Skeleton width={80} height={24} />
          <Skeleton width={80} height={24} />
        </div>
      </section>

      {/* Meta Stats Row */}
      <section className="skeleton-meta-row mb-lg">
        <Skeleton width={180} height={16} />
      </section>

      {/* Filters */}
      <header className="skeleton-filters mb-lg">
        <div className="left-filters gap-sm">
          <Skeleton width={80} height={32} className="skeleton-badge" />
          <Skeleton width={80} height={32} className="skeleton-badge" />
        </div>
        <Skeleton width={120} height={32} className="skeleton-badge" />
      </header>

      {/* Grid */}
      <section className="skeleton-grid gap-lg">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width="100%" className="skeleton-poster" />
        ))}
      </section>
    </main>
  );
}
