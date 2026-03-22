import Skeleton from "@/components/ui/skeleton/skeleton";
import "./list-skeleton.scss";

export default function ListSkeleton() {
  return (
    <main className="list-skeleton-page container">
      {/* Title */}
      <div className="skeleton-title">
        <Skeleton width="60%" height={32} />
      </div>

      {/* Backdrop */}
      <Skeleton width="100%" className="skeleton-backdrop" />

      {/* Author Section */}
      <section className="skeleton-author-section">
        <div className="author-info">
          <Skeleton width={44} height={44} variant="circle" />
          <div className="author-details">
            <Skeleton width={120} height={20} />
            <Skeleton width={150} height={16} />
          </div>
        </div>
        <Skeleton width={24} height={24} />
      </section>

      {/* Description */}
      <section className="skeleton-description">
        <Skeleton width="100%" height={16} className="skeleton-desc-line" />
        <Skeleton width="100%" height={16} className="skeleton-desc-line" />
        <Skeleton width="80%" height={16} />
        <div className="skeleton-desc-button">
          <Skeleton width={30} height={16} />
        </div>
      </section>

      {/* Stats */}
      <section className="skeleton-stats">
        <div className="skeleton-stats-row">
          <Skeleton width={80} height={24} />
          <Skeleton width={80} height={24} />
        </div>
      </section>

      {/* Meta Stats Row */}
      <section className="skeleton-meta-row">
        <Skeleton width={180} height={16} />
      </section>

      {/* Filters */}
      <header className="skeleton-filters">
        <div className="left-filters">
          <Skeleton width={80} height={32} className="skeleton-badge" />
          <Skeleton width={80} height={32} className="skeleton-badge" />
        </div>
        <Skeleton width={120} height={32} className="skeleton-badge" />
      </header>

      {/* Grid */}
      <section className="skeleton-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width="100%" className="skeleton-poster" />
        ))}
      </section>
    </main>
  );
}
