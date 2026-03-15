import { Image } from "@unpic/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bookmark, ChevronDown, Film, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import "./list-details.scss";
import MovieCard from "../../movie-card/movie-card";
import Title from "../../title/title";
import type { MovieType } from "@/utils/types/movie";
import Badge from "@/components/ui/badge/badge";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth";
import { useSaveList } from "@/queries/list.mutations";
import { listDataQuery } from "@/queries/list.queries";
import { formatCompactNumber } from "@/utils/format-compact-number";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

export default function ListDetails() {
  const routeApi = getRouteApi("/lists/$listId/");
  const { listId } = routeApi.useParams();

  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "watched" | "unwatched">(
    "all",
  );
  const [selectedGenre, setSelectedGenre] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "default" | "release_date" | "title" | "oldest"
  >("default");

  const { data: listData } = useSuspenseQuery(listDataQuery(listId));
  const { mutate: saveList } = useSaveList(listId);

  const movies = listData.movies;

  const watchedPercent = useMemo(() => {
    if (!movies) return 0;
    const watchedCount = movies.filter((m: MovieType) => m.seen_at).length;
    return Math.round((watchedCount / movies.length) * 100);
  }, [movies]);

  // GENRES
  const availableGenres = useMemo(() => {
    if (!movies) return [];

    const genreMap = new Map<number, string>();
    movies.forEach((m: { genres: Array<{ id: number; name: string }> }) => {
      m.genres.forEach((g) => {
        if (g.id && g.name) genreMap.set(g.id, g.name);
      });
    });
    return Array.from(genreMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [movies]);

  // FILTRAGE
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (filterType === "watched") {
      result = result.filter((m) => m.seen_at);
    } else if (filterType === "unwatched") {
      result = result.filter((m) => !m.seen_at);
    }

    if (selectedGenre !== "all") {
      result = result.filter(
        (m) =>
          m.genres &&
          m.genres.some((g: { id: number }) => g.id === selectedGenre),
      );
    }

    if (sortBy === "release_date") {
      result.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
    } else if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime(),
      );
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [movies, filterType, selectedGenre, sortBy]);
  return (
    <main className="list-details-page container">
      <Title
        title={listData.title}
        variant="h1"
        size="lg"
        className="list-title"
      />

      <Image
        src={getCloudinarySrc(movies[0].backdrop_path, "backdrops")}
        alt="Backdrop de la liste"
        layout="fullWidth"
        aspectRatio={16 / 9}
        background="auto"
        className="list-backdrop"
      />

      <section className="author-section">
        <div className="author-info">
          {user?.avatar_path ? (
            <Image
              src={getCloudinarySrc(user.avatar_path, "avatars")}
              layout="constrained"
              width={44}
              height={44}
              alt={user.username}
              background="auto"
              priority
              className="avatar"
            />
          ) : (
            <div
              className="avatar font-sentient"
              aria-label={`Initiale de ${user?.username}`}
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
          )}

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
          <Bookmark
            size={20}
            fill={listData.is_saved ? "currentColor" : "none"}
          />
        </button>
      </section>

      <section className="description-section">
        <p
          className={`description-text truncate-3-lines ${isExpanded ? "expanded" : ""}`}
        >
          {listData.description}
        </p>
        <button
          className={`expand-button ${isExpanded ? "is-expanded" : ""}`}
          aria-label={isExpanded ? "Réduire la description" : "Lire la suite"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          ...
        </button>
      </section>

      <section className="list-stats">
        <p className="list-stat">
          <Film size={18} />
          {movies.length} films
        </p>

        {user && (
          <p className="list-stat">
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
                  strokeDasharray={`${(watchedPercent / 100) * 56.5} 56.5`}
                  strokeLinecap="round"
                  transform="rotate(-90 12 12)"
                  className="progress"
                />
              </svg>
            </div>
            {watchedPercent}% vu
          </p>
        )}
      </section>

      <section className="meta-stats-row">
        <TrendingUp size={14} />
        <span>
          Suivi par{" "}
          <span className="highlight">
            {formatCompactNumber(listData.saved_count)}
          </span>{" "}
          membres
        </span>
      </section>

      <section>
        <header className="list-filters">
          <div className="left-filters">
            {user && (
              <DropdownMenu>
                <DropdownTrigger>
                  <Badge variant="secondary" className="filter-badge" size="lg">
                    <span className="truncate">
                      {filterType === "all"
                        ? "Statut"
                        : filterType === "unwatched"
                          ? "À voir"
                          : "Vu"}
                    </span>
                    <ChevronDown size={14} className="icon-shrink" />
                  </Badge>
                </DropdownTrigger>
                <DropdownContent align="left">
                  <DropdownItem onClick={() => setFilterType("all")}>
                    Tous
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilterType("unwatched")}>
                    À voir
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilterType("watched")}>
                    Vu
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownTrigger>
                <Badge variant="secondary" className="filter-badge" size="lg">
                  <span className="truncate">
                    {selectedGenre === "all"
                      ? "Genre"
                      : availableGenres.find(
                          ([id]) => id === selectedGenre,
                        )?.[1]}
                  </span>
                  <ChevronDown size={14} className="icon-shrink" />
                </Badge>
              </DropdownTrigger>
              <DropdownContent align="right">
                <DropdownItem onClick={() => setSelectedGenre("all")}>
                  Tous les genres
                </DropdownItem>
                {availableGenres.map(([id, name]) => (
                  <DropdownItem key={id} onClick={() => setSelectedGenre(id)}>
                    {name}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownTrigger>
              <Badge variant="secondary" className="filter-badge" size="lg">
                <span className="truncate">
                  {sortBy === "default" && "Tri par défaut"}
                  {sortBy === "release_date" && "Plus récent"}
                  {sortBy === "oldest" && "Plus ancien"}
                  {sortBy === "title" && "Alphabétique"}
                </span>
                <ChevronDown size={14} className="icon-shrink" />
              </Badge>
            </DropdownTrigger>
            <DropdownContent align="left">
              <DropdownItem onClick={() => setSortBy("default")}>
                Par défaut
              </DropdownItem>
              <DropdownItem onClick={() => setSortBy("release_date")}>
                Plus récent
              </DropdownItem>
              <DropdownItem onClick={() => setSortBy("oldest")}>
                Plus ancien
              </DropdownItem>
              <DropdownItem onClick={() => setSortBy("title")}>
                Alphabétique
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </header>

        <section className="posters-grid">
          {filteredMovies.length === 0 ? (
            <p className="empty-state">
              Aucun film ne correspond à vos filtres.
            </p>
          ) : (
            filteredMovies.map((movie: MovieType) => (
              <MovieCard key={movie.id} movie={movie} size="sm" />
            ))
          )}
        </section>
      </section>
    </main>
  );
}
