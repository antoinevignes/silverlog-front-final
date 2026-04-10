import Skeleton from "@/components/ui/skeleton/skeleton";
import "./diary-skeleton.scss";

export default function DiarySkeleton() {
  const mobileItems = Array.from({ length: 4 });
  const gridDays = Array.from({ length: 35 });

  return (
    <div className="diary-layout container gap-lg">
      <section className="diary-content diary-skeleton">
        {[1, 2].map((month) => (
          <div key={month} className="diary-month-wrapper mb-lg">
            <header className="skeleton-header mt-2xl mb-md">
              <Skeleton width="40%" height="2rem" />
            </header>

            <div className="diary-mobile-skeleton gap-md">
              {mobileItems.map((_, i) => (
                <div key={`mobile-${i}`} className="skeleton-item gap-md p-sm">
                  <Skeleton
                    width={60}
                    height={90}
                    className="skeleton-poster"
                  />
                  <div className="skeleton-info gap-sm">
                    <Skeleton
                      width="80%"
                      height="1.25rem"
                      className="skeleton-title"
                    />
                    <Skeleton
                      width="30%"
                      height="1rem"
                      className="skeleton-year"
                    />
                    <Skeleton
                      width="40%"
                      height="1.5rem"
                      className="skeleton-rating mt-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="diary-desktop-skeleton">
              <div className="calendar-grid-skeleton gap-sm">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton
                    key={`day-${i}`}
                    className="weekday-label-skeleton my-sm"
                  />
                ))}

                {gridDays.map((_, i) => {
                  const isFilled = i > 4 && i < 12;
                  return (
                    <div
                      key={`grid-${i}`}
                      className={`calendar-day-skeleton ${isFilled ? "filled" : ""}`}
                    >
                      {isFilled && <Skeleton className="poster-placeholder" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </section>

      <aside className="diary-sidebar-skeleton gap-lg">
        <div className="sidebar-card-skeleton px-sm mb-md">
          <Skeleton className="card-title-skeleton mb-lg" />
          <div className="stat-row-skeleton mb-md">
            <Skeleton className="stat-label-skeleton" />
            <Skeleton className="stat-value-skeleton" />
          </div>
          <div className="stat-row-skeleton mb-md">
            <Skeleton className="stat-label-skeleton" />
            <Skeleton className="stat-value-skeleton" />
          </div>
        </div>

        <div className="sidebar-card-skeleton px-sm mb-md">
          <Skeleton className="card-title-skeleton mb-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`time-${i}`} className="timeline-item-skeleton mb-sm ml-lg" />
          ))}
        </div>
      </aside>
    </div>
  );
}
