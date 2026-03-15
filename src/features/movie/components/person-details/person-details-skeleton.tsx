import Skeleton from "@/components/ui/skeleton/skeleton";
import "./person-details.scss";
import "./person-details-skeleton.scss";

export default function PersonDetailsSkeleton() {
  return (
    <main className="container person-page">
      <article className="person">
        <aside className="person-sidebar">
          <figure className="person-avatar">
            <Skeleton width="100%" height="100%" className="poster-img" />
          </figure>

          <section className="person-meta person-meta-skeleton">
            <Skeleton width="60%" height={32} className="mobile-only-title" />

            <div className="meta-details meta-details-skeleton">
              <Skeleton width="80%" height={24} />
              <Skeleton width="70%" height={24} />
              <Skeleton width="90%" height={24} />
            </div>
          </section>
        </aside>

        <section className="person-main-content person-main-content-skeleton">
          <Skeleton width="40%" height={40} className="desktop-only-title" />
          <Skeleton width="100%" height={48} /> {/* Tabs */}
          {/* Biography */}
          <div className="biography-skeleton">
            <Skeleton width="100%" height={20} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="95%" height={20} />
            <Skeleton width="90%" height={20} />
            <Skeleton width="98%" height={20} />
            <Skeleton width="80%" height={20} />
          </div>
          {/* Known for section */}
          <section className="known-for-section known-for-section-skeleton">
            <Skeleton width="30%" height={28} className="known-for-title" />
            <ul className="person-movie-list known-for-list known-for-list-skeleton">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <Skeleton
                    width="100%"
                    height="100%"
                    className="movie-card-skeleton"
                  />
                </li>
              ))}
            </ul>
          </section>
        </section>
      </article>
    </main>
  );
}
