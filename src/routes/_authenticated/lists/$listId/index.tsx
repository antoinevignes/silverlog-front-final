import { createFileRoute } from "@tanstack/react-router";
import { Film, Bookmark } from "lucide-react";
import "./index.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listDataQuery } from "@/queries/list.queries";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import MovieCard from "@/components/layout/movie-card/movie-card";
import { useSaveList } from "@/queries/list.mutations";

export const Route = createFileRoute("/_authenticated/lists/$listId/")({
  component: ListDetailsPage,
});

function ListDetailsPage() {
  const { listId } = Route.useParams();

  const { data: listData } = useSuspenseQuery(listDataQuery(listId));
  const { mutate: saveList } = useSaveList(listId);

  const movies = listData.movies;

  return (
    <main className="list-details-page container">
      <h1 className="list-title">{listData.title}</h1>

      <div className="backdrop-container">
        <Image
          src={getCloudinarySrc(movies[0].backdrop_path, "backdrops")}
          alt="Posters des films de la liste"
          layout="fullWidth"
          aspectRatio={2 / 3}
          background={getCloudinaryPlaceholder(
            movies[0].backdrop_path,
            "posters",
          )}
          className="preview-poster"
        />
      </div>

      <section className="author-section">
        <div className="author-info">
          <div className="author-details">
            <span className="author-name">{listData.username}</span>
            <span className="updated-date">
              Mis à jour il y a{" "}
              {formatDistanceToNow(new Date(listData.updated_at), {
                locale: fr,
              })}
            </span>
          </div>
        </div>

        <button
          className="save-button"
          aria-label="Sauvegarder la liste"
          onClick={() => saveList()}
        >
          <Bookmark size={20} fill={listData.is_saved ? "white" : "none"} />
        </button>
      </section>

      <section className="description-section">
        <p className="description-text">{listData.description}</p>
        <button className="expand-button" aria-label="Lire la suite">
          ...
        </button>
      </section>

      <section className="stats-buttons-row">
        <button className="stat-btn">
          <Film size={18} />
          {movies.length} films
        </button>
        {/* <button className="stat-btn">
          <div className="progress-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                strokeWidth="3"
                stroke="#e5e7eb"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${(listData.stats.watchedPercent / 100) * 56.5} 56.5`}
                strokeLinecap="round"
                transform="rotate(-90 12 12)"
              />
            </svg>
          </div>
          {listData.stats.watchedPercent}% vu
        </button> */}
      </section>

      {/* <section className="meta-stats-row">
        <div className="saves-stat">
          <TrendingUp size={14} />
          <span>
            Suivi par <span className="highlight">1200</span> membres
          </span>
        </div>

        <div className="engagement-stats">
          <div className="eng-stat">
            <Heart size={14} />
            <span>{listData.stats.likesCount}</span>
          </div>
          <div className="eng-stat">
            <MessageCircle size={14} />
            <span>{listData.stats.commentsCount}</span>
          </div>
        </div>
      </section> */}

      {/* <section className="filters-row">
        <div className="filters-left">
          <Badge className="filter-btn">
            <SlidersHorizontal size={14} />
            Filtrer
          </Badge>
          <Badge className="active-filter">
            A voir
            <span aria-label="Remove filter">
              <X size={14} />
            </span>
          </Badge>
        </div>

        <div className="filters-right">
          <Badge className="sort-dropdown">
            Trier par <ChevronDown size={14} />
          </Badge>
        </div>
      </section> */}

      <section className="posters-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}
