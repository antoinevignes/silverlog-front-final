import "./movie-header.scss";
import { Link, getRouteApi } from "@tanstack/react-router";
import { Dot, Film } from "lucide-react";
import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import MovieActions from "@/features/movie/components/dialogs/movie-actions/movie-actions";
import Title from "@/components/ui/title/title";
import Tabs from "@/components/ui/tabs/tabs";
import {
  movieCreditsQuery,
  movieDataQuery,
  movieDetailsQuery,
} from "@/features/movie/api/movie.queries";
import MovieDetails from "@/features/movie/components/movie-tabs/movie-details";
import MovieCast from "@/features/movie/components/movie-tabs/movie-cast";
import MovieCrew from "@/features/movie/components/movie-tabs/movie-crew";
import SynopsisContainer from "@/features/movie/components/synopsis-container/synopsis-container";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import RatingBadge from "@/features/movie/components/rating-badge/rating-badge";

const tabs = [
  { id: "details", label: "Détails" },
  { id: "cast", label: "Distribution" },
  { id: "crew", label: "Équipe technique" },
];

export default function MovieHeader() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const { tab } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const { data: movie } = useSuspenseQuery(movieDetailsQuery(movieId));
  const { data: movieData } = useSuspenseQuery(movieDataQuery(movieId));
  const { data: credits } = useSuspenseQuery(movieCreditsQuery(movieId));

  const director = useMemo(() => {
    return credits.crew.find(
      (item: { job: string }) => item.job === "Director",
    );
  }, [credits]);

  const movieYear = useMemo(() => {
    if (!movie.release_date) return NaN;
    return new Date(movie.release_date).getFullYear();
  }, [movie.release_date]);

  const backdropSrc = getCloudinarySrc(movie.backdrop_path, "backdrops");
  const posterSrc = getCloudinarySrc(movie.poster_path, "posters");

  const voteCount =
    Number(movieData.rating_count ?? 0) + Number(movie.vote_count);
  const voteAvg =
    (Number(movieData.movie_avg ?? 0) * Number(movieData.rating_count ?? 0) +
      Number(movie.vote_average) * Number(movie.vote_count)) /
    (voteCount || 1);

  return (
    <>
      {backdropSrc ? (
        <Image
          src={backdropSrc}
          layout="fullWidth"
          aspectRatio={21 / 9}
          sizes="100vw"
          alt={`Bannière du film ${movie.title}`}
          background="auto"
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
                  layout="constrained"
                  width={300}
                  aspectRatio={2 / 3}
                  alt={`Affiche du film ${movie.title}`}
                  background="auto"
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
                voteAvg={voteAvg}
                voteCount={voteCount}
                className="grade-mobile"
              />
            </div>
          </div>

          <div className="movie-details">
            <Title title={movie.title} size="xl" variant="h1" />

            {director && (
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
            )}

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
              voteAvg={voteAvg}
              voteCount={voteCount}
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
            selected={tab}
            setSelected={(id) =>
              navigate({ search: { tab: id as any }, replace: true })
            }
            tabs={tabs}
            variant="transparent"
          />

          {tab === "details" && <MovieDetails />}

          {tab === "cast" && <MovieCast />}

          {tab === "crew" && <MovieCrew />}
        </section>
      </article>
    </>
  );
}
