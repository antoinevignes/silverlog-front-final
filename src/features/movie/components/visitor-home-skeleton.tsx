import { BookText, Star, Users } from "lucide-react";
import Button from "@/components/ui/button/button";
import Skeleton from "@/components/ui/skeleton/skeleton";
import Title from "@/components/ui/title/title";
import "./visitor-home-skeleton.scss";

export default function VisitorHomeSkeleton() {
  return (
    <main className="visitor-home">
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">
            Suivez, notez et partagez votre passion du cinéma.
          </h1>

          <p className="hero-subtitle">
            Silverlog est le réseau social de ceux qui aiment les films. Tenez
            votre journal, découvrez ce que vos amis regardent.
          </p>

          <div className="hero-actions">
            <Button size="lg" className="cta-btn" disabled>
              Rejoindre la communauté
            </Button>

            <Button size="lg" variant="outline" className="cta-btn secondary" disabled>
              Se connecter
            </Button>
          </div>
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

      <section className="features-section">
        <div className="container">
          <Title
            title=" Pourquoi utiliser Silverlog ?"
            className="section-title text-center"
          />

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon-wrapper">
                <BookText size={32} />
              </div>
              <Title
                variant="h3"
                size="sm"
                title="Tenez votre Journal"
                className="feature-title"
              />
              <p className="feature-desc">
                Enregistrez chaque film que vous regardez. Conservez un
                historique de votre vie de cinéphile.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon-wrapper">
                <Star size={32} />
              </div>
              <Title
                variant="h3"
                size="sm"
                title="Notez & Critiquez"
                className="feature-title"
              />
              <p className="feature-desc">
                Partagez votre avis avec le monde entier. De 1 à 10, faites
                entendre votre voix sur chaque œuvre détaillée.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon-wrapper">
                <Users size={32} />
              </div>
              <Title
                variant="h3"
                size="sm"
                title="Créez votre communauté"
                className="feature-title"
              />
              <p className="feature-desc">
                Suivez vos amis, découvrez leurs films coups de cœur et échangez
                vos recommandations au quotidien.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="container community-section">
        <Title title="La communauté en parle" className="section-title" />
        <div className="community-reviews-grid">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="community-review-card-skeleton">
              <Skeleton width={100} height={150} />
              <div className="review-content-skeleton">
                <Skeleton width="40%" height="16px" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="48px" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
