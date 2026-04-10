import {
  Award,
  Bookmark,
  Calendar,
  Clapperboard,
  Clock,
  Film,
  List,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import "./stats.scss";

export default function Stats({ user }: { user: any }) {
  return (
    <section className="content-section" aria-label="Statistiques détaillées">
      <div className="stats-masonry">
        <article className="stat-card">
          <Film className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">{user.viewed_movies}</strong>
          <span className="stat-label">Films vus au total</span>
        </article>

        <article className="stat-card highlight-dark">
          <Clapperboard className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">David Fincher</strong>
          <span className="stat-label">Réalisateur le plus vu (12 films)</span>
        </article>

        <article className="stat-card">
          <Star className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">{user.avg_rating}</strong>
          <span className="stat-label">Note moyenne attribuée</span>
        </article>

        <article className="stat-card highlight-accent">
          <Clock className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">342h 15m</strong>
          <span className="stat-label">Temps total de visionnage (estimé)</span>
        </article>

        <article className="stat-card">
          <Calendar className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">{user.viewed_movies_this_year}</strong>
          <span className="stat-label">Films regardés cette année</span>
        </article>

        <article className="stat-card">
          <TrendingUp className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">Science-Fiction</strong>
          <span className="stat-label">Genre préféré (48 films)</span>
        </article>

        <article className="stat-card">
          <Users className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">Ryan Gosling</strong>
          <span className="stat-label">Acteur le plus vu (18 films)</span>
        </article>

        <article className="stat-card highlight-dark">
          <Award className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">1999</strong>
          <span className="stat-label">Année récurrente (42 films)</span>
        </article>

        <article className="stat-card">
          <List className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">{user.custom_lists.length}</strong>
          <span className="stat-label">Listes publiques créées</span>
        </article>

        <article className="stat-card">
          <Bookmark className="stat-icon" size={24} aria-hidden />
          <strong className="stat-value">{user.watchlist_movies.length}</strong>
          <span className="stat-label">Films dans la Watchlist</span>
        </article>
      </div>
    </section>
  );
}
