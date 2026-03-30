import { Link } from "@tanstack/react-router";
import { BookText, Star, Users } from "lucide-react";
import Button from "@/components/ui/button/button";
import "./visitor-home.scss";
import Title from "@/components/ui/title/title";
import CrewPicks from "./crew-picks/crew-picks";
import { SuspenseSection } from "@/components/ui/suspense-section/suspense-section";
import CrewPicksSkeleton from "./crew-picks/crew-picks-skeleton";
import CommunityReviews from "./community-reviews/community-reviews";
import CommunityReviewsSkeleton from "./community-reviews/community-reviews-skeleton";

export default function VisitorHome() {
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
            <Link to="/auth/sign-up">
              <Button size="lg" className="cta-btn">
                Rejoindre la communauté
              </Button>
            </Link>

            <Link to="/auth/sign-in" search={{ redirect: "/" }}>
              <Button size="lg" variant="outline" className="cta-btn secondary">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SuspenseSection
        title="La sélection de la rédaction"
        fallback={<CrewPicksSkeleton />}
        className="container"
      >
        <CrewPicks />
      </SuspenseSection>

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

      <SuspenseSection
        title="La communauté en parle"
        className="container"
        fallback={<CommunityReviewsSkeleton />}
      >
        <CommunityReviews />
      </SuspenseSection>
    </main>
  );
}
