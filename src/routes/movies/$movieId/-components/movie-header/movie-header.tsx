import "./movie-header.scss";
import Tabs from "@/components/ui/tabs/tabs";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Dot, Film, Star } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  movieCreditsQuery,
  movieDataQuery,
  movieDetailsQuery,
} from "@/queries/movie.queries";
import type { MovieType } from "@/utils/types/movie";
import MovieDetails from "@/components/layout/movie-tabs/movie-details";
import MovieCast from "@/components/layout/movie-tabs/movie-cast";
import MovieCrew from "@/components/layout/movie-tabs/movie-crew";
import Skeleton from "@/components/ui/skeleton/skeleton";

const tabs = [
  { id: "details", label: "Détails" },
  { id: "cast", label: "Distribution" },
  { id: "crew", label: "Équipe technique" },
];

export default function MovieHeader() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();

  const [selected, setSelected] = useState<string>("details");

  const { data: movie, isLoading: isLoadingDetails } = useQuery(
    movieDetailsQuery(movieId),
  );
  const { data: movieData, isLoading: isLoadingData } = useQuery(
    movieDataQuery(movieId),
  );
  const { data: credits, isLoading: isLoadingCredits } = useQuery(
    movieCreditsQuery(movieId),
  );

  const director = useMemo(() => {
    return credits?.crew?.find(
      (item: { job: string }) => item.job === "Director",
    );
  }, [credits]);

  const movieYear = useMemo(() => {
    if (!movie?.release_date) return NaN;
    return new Date(movie.release_date).getFullYear();
  }, [movie?.release_date]);

  if (isLoadingDetails || isLoadingData || isLoadingCredits) {
    return <MovieHeaderSkeleton />;
  }

  return (
    <>
      <div className="image-container">
        <picture>
          <source
            srcSet={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
            media="(min-width: 768px)"
          />
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
            alt={`Affiche du film ${movie.title}`}
            className="image-backdrop"
          />
        </picture>
      </div>

      <article className="movie container">
        <header className="movie-header">
          <div>
            {!movie.poster_path ? (
              <div className="header-poster-fallback">
                <Film size={64} aria-hidden color="#262626" />
              </div>
            ) : (
              <picture>
                <source
                  srcSet={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  media="(min-width: 768px)"
                />

                <img
                  src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt={`Poster du film ${movie.title}`}
                />
              </picture>
            )}
          </div>

          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>

            <p className="director-wrapper">
              Réal. par{" "}
              <Link to="/" className="underline-link">
                {director.name}
              </Link>
            </p>

            <p className="movie-meta">
              <Link
                to="/"
                className="underline-link"
                disabled={Number.isNaN(movieYear)}
              >
                {!Number.isNaN(movieYear) ? movieYear : "NC"}
              </Link>

              <Dot aria-hidden />

              <time dateTime={`PT${movie.runtime}M`}>{movie.runtime} mins</time>
            </p>

            <p className="grade">
              <Star size={20} aria-hidden color="#F1DA51" fill="#F1DA51" />

              <span className="rating">
                {movieData.movie_avg
                  ? movieData.movie_avg
                  : Math.round(movie.vote_average * 10) / 10}
                /10
              </span>

              <span className="text-secondary rating-count">
                (
                {movieData.rating_count > 0
                  ? movieData.rating_count.toLocaleString()
                  : movie.vote_count.toLocaleString()}
                )
              </span>
            </p>

            <SynopsisContainer movie={movie} className="synopsis-desktop" />
          </div>
        </header>

        <SynopsisContainer movie={movie} className="synopsis-mobile" />

        <section className="details-section">
          <Tabs
            selected={selected}
            setSelected={setSelected}
            tabs={tabs}
            variant="transparent"
          />

          {selected === "details" && <MovieDetails />}

          {selected === "cast" && <MovieCast />}

          {selected === "crew" && <MovieCrew />}
        </section>
      </article>
    </>
  );
}

function SynopsisContainer({
  movie,
  className,
}: {
  movie: MovieType;
  className: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const overviewPreviewLength = 180;
  const shouldShowReadMore =
    movie.overview.length > overviewPreviewLength && !isExpanded;

  return (
    <section className={`synopsis ${className}`}>
      {movie.tagline && (
        <p className="tagline text-secondary">"{movie.tagline}"</p>
      )}

      <p className={isExpanded ? "overview-expanded" : "overview-preview"}>
        {isExpanded || className === "synopsis-desktop"
          ? movie.overview
          : shouldShowReadMore
            ? `${movie.overview.substring(0, overviewPreviewLength)}...`
            : movie.overview}
      </p>

      {shouldShowReadMore && className !== "synopsis-desktop" && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(true)}
          aria-expanded={isExpanded}
        >
          Voir plus
        </button>
      )}

      {isExpanded && movie.overview.length > overviewPreviewLength && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(false)}
          aria-expanded={isExpanded}
        >
          Voir moins
        </button>
      )}

      <ul className="genre-badges">
        {movie.genres.map((genre: { name: string }) => (
          <li key={genre.name}>
            <Badge variant="outline">{genre.name}</Badge>
          </li>
        ))}
      </ul>

      {/* <MovieActions /> */}
    </section>
  );
}

function MovieHeaderSkeleton() {
  return (
    <>
      <div className="image-container">
        <Skeleton width="100%" height="100%" />
      </div>

      <article className="movie container">
        <header className="movie-header">
          <div>
            <Skeleton className="header-poster-fallback" />
          </div>

          <div className="movie-details">
            <Skeleton width="10rem" height={32} className="movie-title" />

            <div className="director-wrapper">
              <Skeleton width={100} height={16} />
            </div>

            <div className="movie-meta">
              <Skeleton width={50} height={16} />
            </div>

            <div className="grade">
              <Skeleton width={100} height={30} />
            </div>

            <Skeleton
              width="100%"
              height="100%"
              className="synopsis synopsis-desktop"
            />

            <Skeleton width={100} height={16} className="genre-badges" />
          </div>
        </header>

        <Skeleton
          width="100%"
          height="10rem"
          className="synopsis synopsis-mobile"
        />

        <section className="details-section">
          <Skeleton width="100%" height="10rem" className="tabs" />
        </section>
      </article>
    </>
  );
}
