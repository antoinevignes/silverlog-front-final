import { format } from "date-fns";
import DiarySkeleton from "../../diary/diary-skeleton/diary-skeleton";
import { fr } from "date-fns/locale";
import DiaryMobile from "../../diary/diary-mobile/diary-mobile";
import DiaryDesktop from "../../diary/diary-desktop/diary-desktop";
import "./diary.scss";

export default function Diary({
  isFetchingMovies,
  groups,
  averageRating,
  totalMovies,
}: {
  isFetchingMovies: boolean;
  groups: any[];
  averageRating: string | null;
  totalMovies: number;
}) {
  return (
    <main className="container diary-page">
      {isFetchingMovies ? (
        <DiarySkeleton />
      ) : (
        <div className="diary-layout">
          <section className="diary-content">
            {groups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="diary-month-wrapper"
              >
                <header className="month-header">
                  <h2>
                    <time dateTime={format(group.date, "yyyy-MM")}>
                      {format(group.date, "MMMM yyyy", { locale: fr })}
                    </time>
                  </h2>
                </header>

                <DiaryMobile movies={group.movies} />
                <DiaryDesktop monthDate={group.date} movies={group.movies} />
              </section>
            ))}
          </section>

          {groups.length > 0 && (
            <aside className="diary-sidebar">
              <section className="sidebar-card stats-card">
                <h3>Statistiques</h3>
                <ul>
                  <li>
                    <span className="stat-label">Films vus</span>
                    <span className="stat-value">{totalMovies}</span>
                  </li>
                  {averageRating && (
                    <li>
                      <span className="stat-label">Note moyenne</span>
                      <span className="stat-value">
                        {Number(averageRating) / 2} / 10
                      </span>
                    </li>
                  )}
                </ul>
              </section>

              <section className="sidebar-card timeline-card">
                <h3>Chronologie</h3>
                <nav className="timeline-nav">
                  <ul>
                    {groups.map((group) => (
                      <li key={`nav-${group.id}`}>
                        <a href={`#${group.id}`}>
                          {format(group.date, "MMMM yyyy", { locale: fr })}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>
            </aside>
          )}
        </div>
      )}
    </main>
  );
}
