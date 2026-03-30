import { Link } from "@tanstack/react-router";
import { BookText, Star, Users } from "lucide-react";
import Button from "@/components/ui/button/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { recentReviewsQuery } from "@/features/review/api/review.query";
import "./visitor-home.scss";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import Title from "@/components/ui/title/title";
import { Card } from "@/components/ui/card/card";
import CrewPicks from "./crew-picks/crew-picks";

export default function VisitorHome() {
  const { data: recentReviews } = useSuspenseQuery(recentReviewsQuery());

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

      <CrewPicks />

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
          {recentReviews && recentReviews.length > 0 ? (
            recentReviews.map((review: any) => (
              <Card key={review.id} className="community-review-card">
                <div className="review-poster">
                  <Image
                    src={getCloudinarySrc(review.movie_poster_path, "posters")}
                    background="auto"
                    layout="constrained"
                    width={100}
                    height={150}
                    alt={`Affiche du film ${review.title}`}
                  />
                </div>

                <div className="review-content">
                  <header className="review-header">
                    <span className="review-user">{review.username}</span>

                    <span className="review-action">
                      a noté <strong>{review.title}</strong>
                    </span>

                    <div className="review-stars">
                      <Star size={14} fill="currentColor" />
                      {review.rating / 2} / 10{" "}
                    </div>
                  </header>

                  <p className="review-text">"{review.content}"</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-secondary text-center">
              Aucune critique récente.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
