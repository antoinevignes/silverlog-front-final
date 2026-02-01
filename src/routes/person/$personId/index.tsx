import "./person.scss";
import BiographyContainer from "@/components/layout/biography-container/biography-container";
import MovieCard from "@/components/layout/movie-card/movie-card";
import { Separator } from "@/components/ui/separator";
import Tabs from "@/components/ui/tabs/tabs";
import {
  personCreditsQuery,
  personDetailsQuery,
} from "@/queries/person.queries";
import { dateFormatter } from "@/utils/date-formatter";
import { getDynamicTabs } from "@/utils/dynamic-tabs";
import translateJob from "@/utils/translate-job";
import type { MovieType } from "@/utils/types/movie";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Cake, CircleUser, Film, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/person/$personId/")({
  loader: ({ context: { queryClient }, params: { personId } }) => {
    queryClient.prefetchQuery(personDetailsQuery(personId));
    queryClient.prefetchQuery(personCreditsQuery(personId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { personId } = Route.useParams();

  const [selected, setSelected] = useState<string>("details");

  const { data: personDetails, isLoading: isLoadingPerson } = useQuery(
    personDetailsQuery(personId),
  );
  const { data: personCredits, isLoading: isLoadingCredits } = useQuery(
    personCreditsQuery(personId),
  );

  const dynamicTabs = useMemo(
    () => getDynamicTabs(personDetails, personCredits),
    [personDetails, personCredits],
  );

  const dateFr = useMemo(() => {
    if (!personDetails?.birthday) return "NC";

    return dateFormatter.format(new Date(personDetails.birthday));
  }, [personDetails?.birthday]);

  if (isLoadingPerson || isLoadingCredits) {
    return <div>Chargement...</div>;
  }

  if (!personDetails || !personCredits) return null;

  console.log(personDetails);

  return (
    <main>
      <div className="image-container" aria-hidden>
        {!personCredits.cast[0]?.backdrop_path ? (
          <div className="image-backdrop-fallback">
            <Film size={64} color="#737373" />
          </div>
        ) : (
          <picture>
            <source
              srcSet={`https://image.tmdb.org/t/p/w1280/${personCredits.cast[0]?.backdrop_path}`}
              media="(min-width: 768px)"
            />
            <img
              src={`https://image.tmdb.org/t/p/w500/${personCredits.cast[0]?.backdrop_path}`}
              alt={`Affiche du film ${personCredits.cast[0]?.title}`}
              className="image-backdrop"
            />
          </picture>
        )}
      </div>

      <article className="person container">
        <header className="person-header">
          <figure className="person-avatar">
            {!personDetails.profile_path ? (
              <div className="header-poster-fallback">
                <CircleUser size={64} aria-hidden color="#737373" />
              </div>
            ) : (
              <picture>
                <source
                  srcSet={`https://image.tmdb.org/t/p/w200${personDetails.profile_path}`}
                  media="(min-width: 768px)"
                />

                <img
                  src={`https://image.tmdb.org/t/p/w92${personDetails.profile_path}`}
                  alt={`Portait de ${personDetails.name}`}
                />
              </picture>
            )}
          </figure>

          <section className="person-details">
            <h1>{personDetails.name}</h1>

            <ul className="job-list text-secondary">
              {personDetails.known_for_department && (
                <li>
                  <p>{translateJob(personDetails.known_for_department)}</p>
                </li>
              )}
            </ul>

            <div className="birth">
              <p className="text-secondary">
                <Cake size={20} aria-hidden />
                <small>{dateFr}</small>
              </p>

              <p className="text-secondary">
                <MapPin size={20} aria-hidden />
                {personDetails.place_of_birth ?? "NC"}
              </p>
            </div>
          </section>
        </header>

        <section className="movie-section">
          <Tabs
            selected={selected}
            setSelected={setSelected}
            tabs={dynamicTabs}
            variant="transparent"
          />

          {selected === "details" && (
            <>
              <BiographyContainer personDetails={personDetails} />

              <Separator />

              {/* <ul className="person-movie-list">
                {popularWorks.map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
              </ul> */}
            </>
          )}

          {selected === "actor" && (
            <ul className="person-movie-list">
              {personCredits.cast.map((movie: MovieType) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} size="sm" />
                </li>
              ))}
            </ul>
          )}

          {selected === "director" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter((member: { job: string }) => member.job === "Director")
                .map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
            </ul>
          )}

          {selected === "writer" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter(
                  (member: { job: string }) =>
                    member.job === "Story" ||
                    member.job === "Screenplay" ||
                    member.job === "Writer",
                )
                .map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
            </ul>
          )}

          {selected === "composer" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter(
                  (member: { job: string }) =>
                    member.job === "Original Music Composer",
                )
                .map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
            </ul>
          )}

          {selected === "photography" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter(
                  (member: { job: string }) =>
                    member.job === "Director of Photography",
                )
                .map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
            </ul>
          )}

          {selected === "editor" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter((member: { job: string }) => member.job === "Editor")
                .map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
            </ul>
          )}

          {selected === "producer" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter(
                  (member: { job: string }) =>
                    member.job === "Producer" ||
                    member.job === "Executive Producer",
                )
                .map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}
