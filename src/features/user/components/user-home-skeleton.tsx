import { useAuth } from "@/auth";
import Skeleton from "@/components/ui/skeleton/skeleton";
import Title from "@/components/ui/title/title";
import "./user-home-skeleton.scss";

export default function UserHomeSkeleton() {
  const { user } = useAuth();

  return (
    <main className="user-home">
      <header className="home-dashboard-header">
        <div className="container header-container">
          <div className="welcome-section">
            <h1 className="welcome-title font-sentient">
              Bon retour,{" "}
              <span className="highlight-user">{user?.username}</span> !
            </h1>
            <p className="welcome-subtitle text-secondary">
              Voici ce qu'il s'est passé depuis votre dernière visite.
            </p>
          </div>

          <div className="quick-stats-row">
             <Skeleton width="120px" height="32px" />
             <Skeleton width="120px" height="32px" />
          </div>
        </div>
      </header>

      <section className="container trending-section">
        <header className="section-header">
          <Title title="Populaire cette semaine" />
        </header>
        <div className="trending-scroller-skeleton">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} width="150px" height="225px" className="trending-item-skeleton" />
          ))}
        </div>
      </section>

      <section className="container selection-section">
        <Title title="La sélection de la rédaction" className="section-title" />
        <ul className="selection-grid">
          {Array.from({ length: 6 }).map((_, i) => (
             <li key={i}>
               <Skeleton width="100%" height="300px" />
             </li>
          ))}
        </ul>
      </section>

      <section className="container feed-section">
        <Title title="Activité de vos abonnements" />
        <div className="activity-feed">
          {Array.from({ length: 2 }).map((_, i) => (
            <article key={i} className="activity-card">
              <div className="activity-header-skeleton">
                <Skeleton width={32} height={32} className="avatar-skeleton" />
                <Skeleton width="100px" height="16px" />
              </div>
              <div className="activity-body-skeleton">
                <Skeleton width={70} height={105} />
                <div className="feed-content-skeleton">
                  <Skeleton width="60%" height="20px" />
                  <Skeleton width="100%" height="40px" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
