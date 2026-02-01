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
import translateJob from "@/utils/translate-job";
import type { MovieType } from "@/utils/types/movie";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Cake, Dot, Film, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

const tabs = [
  { id: "details", label: "À propos" },
  { id: "actor", label: "Acteur" },
  { id: "producer", label: "Producteur" },
  { id: "story", label: "Scénariste" },
];

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

  const dateFr = useMemo(() => {
    if (!personDetails?.birthday) return "NC";

    return dateFormatter.format(new Date(personDetails.birthday));
  }, [personDetails?.birthday]);

  if (isLoadingPerson || isLoadingCredits) {
    return <div>Chargement...</div>;
  }

  if (!personDetails || !personCredits) return null;

  const uniqueJobs = [
    ...new Set(personCredits.crew.map((member: { job: string }) => member.job)),
  ].filter((job) => job !== "Thanks") as string[];

  const popularWorks = useMemo(() => {
    if (!personCredits) return [];

    const combined = [
      ...(personCredits.cast || []),
      ...(personCredits.crew || []),
    ];

    const uniqueMovies = Array.from(
      new Map(combined.map((movie) => [movie.id, movie])).values(),
    );

    return uniqueMovies
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 12);
  }, [personCredits]);

  return (
    <main>
      <div className="image-container" aria-hidden>
        <picture>
          <source
            srcSet={`https://image.tmdb.org/t/p/w1280/${personCredits.cast[0].backdrop_path}`}
            media="(min-width: 768px)"
          />
          <img
            src={`https://image.tmdb.org/t/p/w500/${personCredits.cast[0].backdrop_path}`}
            alt={`Affiche du film ${personCredits.cast[0].title}`}
            className="image-backdrop"
          />
        </picture>
      </div>

      <article className="person container">
        <header className="person-header">
          <figure className="person-avatar">
            {!personDetails.profile_path ? (
              <div className="header-poster-fallback">
                <Film size={64} aria-hidden color="#262626" />
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
              {uniqueJobs.map((job) => (
                <>
                  <li key={job}>{translateJob(job)}</li>
                  <Dot />
                </>
              ))}

              <li>{personCredits.cast.length > 0 && "Acteur"}</li>
            </ul>

            <div className="birth">
              <p className="text-secondary">
                <Cake size={20} aria-hidden color="#F1DA51" />
                <small>{dateFr}</small>
              </p>

              <p className="text-secondary">
                <MapPin size={20} aria-hidden color="#f73905" />
                {personDetails.place_of_birth}
              </p>
            </div>
          </section>
        </header>

        <section className="movie-section">
          <Tabs
            selected={selected}
            setSelected={setSelected}
            tabs={tabs}
            variant="transparent"
          />

          {selected === "details" && (
            <>
              <BiographyContainer personDetails={personDetails} />

              <Separator />

              <h3 className="font-sentient" style={{ marginTop: "1rem" }}>
                Oeuvres les plus populaires
              </h3>
              <ul className="person-movie-list">
                {popularWorks.map((movie: MovieType) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} size="sm" />
                  </li>
                ))}
              </ul>
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

          {selected === "story" && (
            <ul className="person-movie-list">
              {personCredits.crew
                .filter((member: { job: string }) => member.job === "Story")
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
