import "./movie-header.scss";
import Tabs from "@/components/ui/tabs/tabs";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Dot, Film, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  movieCreditsQuery,
  movieDataQuery,
  movieDetailsQuery,
} from "@/queries/movie.queries";
import MovieDetails from "@/components/layout/movie-tabs/movie-details";
import MovieCast from "@/components/layout/movie-tabs/movie-cast";
import MovieCrew from "@/components/layout/movie-tabs/movie-crew";
import Skeleton from "@/components/ui/skeleton/skeleton";
import SynopsisContainer from "@/components/layout/synopsis-container/synopsis-container";
import MovieActions from "../dialogs/movie-actions/movie-actions";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";

const tabs = [
  { id: "details", label: "Détails" },
  { id: "cast", label: "Distribution" },
  { id: "crew", label: "Équipe technique" },
];

function RatingBadge({
  movie,
  movieData,
  voteAvg,
  className,
}: {
  movie: any;
  movieData: any;
  voteAvg: number;
  className?: string;
}) {
  return (
    <p
      className={`grade ${className || ""}`}
      aria-label={`Note de ${movie?.vote_average} sur 10`}
    >
      <Star className="star-icon" aria-hidden color="#F1DA51" fill="#F1DA51" />

      <strong className="rating">
        <data value={movie?.vote_average}>{Math.round(voteAvg * 10) / 10}</data>
        /10
      </strong>

      <span className="text-secondary rating-count">
        (
        {(
          Number(movieData?.rating_count) + Number(movie?.vote_count)
        ).toLocaleString()}
        )
      </span>
    </p>
  );
}

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

  const backdropSrc = getCloudinarySrc(movie?.backdrop_path, "backdrops");
  const posterSrc = getCloudinarySrc(movie?.poster_path, "posters");

  const voteAvg =
    (Number(movieData.movie_avg) * Number(movieData.rating_count) +
      Number(movie.vote_average) * Number(movie.vote_count)) /
    (Number(movieData.rating_count) + Number(movie.vote_count));

  return (
    <>
      {backdropSrc ? (
        <Image
          src={backdropSrc}
          layout="fullWidth"
          aspectRatio={21 / 9}
          alt={`Affiche du film ${movie.title}`}
          background={getCloudinaryPlaceholder(
            movie.backdrop_path,
            "backdrops",
          )}
          priority
          className="backdrop"
        />
      ) : (
        <div className="backdrop-fallback">
          <Film size={32} aria-hidden color="#262626" />
        </div>
      )}

      <article className="movie container">
        <header className="movie-header">
          <div className="poster-container-wrapper">
            <div className="poster-wrapper">
              {posterSrc ? (
                <Image
                  src={posterSrc}
                  layout="fullWidth"
                  aspectRatio={2 / 3}
                  alt={movie.title}
                  background={getCloudinaryPlaceholder(
                    movie.poster_path,
                    "posters",
                  )}
                  priority
                  className="poster"
                />
              ) : (
                <div className="poster-fallback">
                  <Film size={64} />
                </div>
              )}

              <RatingBadge
                movie={movie}
                movieData={movieData}
                voteAvg={voteAvg}
                className="grade-mobile"
              />
            </div>
          </div>

          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>

            <p className="director-wrapper">
              Réal. par{" "}
              <Link
                to="/person/$personId"
                params={{ personId: String(director.id) }}
                className="underline-link"
              >
                {director.name}
              </Link>
            </p>

            <p
              className="movie-meta"
              role="group"
              aria-label="Informations sur le film"
            >
              {!Number.isNaN(movieYear) ? movieYear : "NC"}

              <Dot aria-hidden />

              <time dateTime={`PT${movie.runtime}M`}>{movie.runtime} mins</time>
            </p>

            <RatingBadge
              movie={movie}
              movieData={movieData}
              voteAvg={voteAvg}
              className="grade-desktop"
            />

            <SynopsisContainer movie={movie} className="synopsis-desktop" />

            <MovieActions
              movie={movie}
              movieYear={movieYear}
              className="actions-desktop"
            />
          </div>
        </header>

        <SynopsisContainer movie={movie} className="synopsis-mobile" />

        <MovieActions
          movie={movie}
          movieYear={movieYear}
          className="actions-mobile"
        />

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

function MovieHeaderSkeleton() {
  return (
    <>
      <Skeleton width="100%" height="100%" className="backdrop-fallback" />

      <article className="movie container">
        <header className="movie-header">
          <div className="poster-container-wrapper">
            <div className="poster-wrapper">
              <Skeleton className="poster-fallback" />
            </div>
            <Skeleton width={100} height={30} className="grade grade-mobile" />
          </div>

          <div className="movie-details">
            <Skeleton width="10rem" height={32} className="movie-title" />

            <div className="director-wrapper">
              <Skeleton width={100} height={16} />
            </div>

            <div className="movie-meta">
              <Skeleton width={50} height={16} />
            </div>

            <div className="grade grade-desktop">
              <Skeleton width={100} height={30} />
            </div>

            <Skeleton
              width="100%"
              height={200}
              className="synopsis synopsis-desktop"
            />

            <Skeleton width={100} height={16} className="genre-badges" />

            <Skeleton width={150} height={20} className="actions-desktop" />
          </div>
        </header>

        <Skeleton
          width="100%"
          height="8rem"
          className="synopsis synopsis-mobile"
        />

        <Skeleton width={100} height={16} className="genre-badges" />

        <Skeleton width={150} height={20} className="actions-mobile" />

        <section className="details-section">
          <Skeleton width="100%" height="10rem" className="tabs" />
        </section>
      </article>
    </>
  );
}
