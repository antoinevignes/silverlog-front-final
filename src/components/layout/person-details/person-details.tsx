import { useSuspenseQueries } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Cake, CircleUser, Clapperboard, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import BiographyContainer from "../biography-container/biography-container";
import MovieCard from "../movie-card/movie-card";
import Title from "../title/title";
import type { MovieType } from "@/utils/types/movie";
import Tabs from "@/components/ui/tabs/tabs";
import {
  personCreditsQuery,
  personDetailsQuery,
  personDetailsQueryUS,
} from "@/queries/person.queries";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { getDynamicTabs } from "@/utils/dynamic-tabs";
import "./person-details.scss";

export default function PersonDetails() {
  const routeApi = getRouteApi("/person/$personId/");
  const { personId } = routeApi.useParams();
  const [selected, setSelected] = useState<string>("details");

  const [
    { data: personDetails },
    { data: personDetailsUS },
    { data: personCredits },
  ] = useSuspenseQueries({
    queries: [
      personDetailsQuery(personId),
      personDetailsQueryUS(personId),
      personCreditsQuery(personId),
    ],
  });

  const dynamicTabs = useMemo(
    () => getDynamicTabs(personDetails, personCredits),
    [personDetails, personCredits],
  );

  // DATE DE NAISSANCE
  const dateFr = useMemo(() => {
    if (!personDetails.birthday) return "NC";
    return format(new Date(personDetails.birthday), "dd MMMM yyyy", {
      locale: fr,
    });
  }, [personDetails.birthday]);

  // AGE
  const ageString = useMemo(() => {
    if (!personDetails.birthday) return null;
    const birthDate = new Date(personDetails.birthday);
    const end = personDetails.deathday
      ? new Date(personDetails.deathday)
      : new Date();

    let age = end.getFullYear() - birthDate.getFullYear();
    const m = end.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birthDate.getDate())) {
      age--;
    }

    if (personDetails.deathday) {
      return `- ${format(new Date(personDetails.deathday), "dd MMMM yyyy", {
        locale: fr,
      })} (Décès à ${age} ans)`;
    }

    return `${age} ans`;
  }, [personDetails.birthday, personDetails.deathday]);

  // METIERS
  const departmentFr = useMemo(() => {
    if (!personDetails.known_for_department) return "Artiste";
    const dict: Record<string, string> = {
      Acting: "Acteur/Actrice",
      Directing: "Réalisation",
      Writing: "Scénario",
      Production: "Production",
      Editing: "Montage",
      Camera: "Photographie",
      Sound: "Son",
      Art: "Direction Artistique",
    };
    return (
      dict[personDetails.known_for_department] ||
      personDetails.known_for_department
    );
  }, [personDetails?.known_for_department]);

  // CONNU POUR
  const popularWorks = useMemo(() => {
    if (!personCredits) return [];
    const isDirector = personDetails?.known_for_department === "Directing";
    let works = isDirector
      ? personCredits.crew.filter((c: any) => c.job === "Director")
      : personCredits.cast;

    works = [...works].sort(
      (a, b) => (b.vote_count || 0) - (a.vote_count || 0),
    );

    const uniqueWorks = Array.from(
      new Map(works.map((item: any) => [item.id, item])).values(),
    ) as Array<MovieType>;

    return uniqueWorks.slice(0, 6);
  }, [personCredits, personDetails?.known_for_department]);

  // LISTE DES FILMS
  const renderMovieList = (movies: Array<MovieType>) => (
    <ul className="person-movie-list">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} size="sm" />
        </li>
      ))}
    </ul>
  );

  return (
    <main className="container person-page">
      <article className="person">
        <aside className="person-sidebar">
          <figure className="person-avatar">
            {!personDetails.profile_path ? (
              <div className="header-poster-fallback">
                <CircleUser size={64} aria-hidden color="#737373" />
              </div>
            ) : (
              <Image
                src={getCloudinarySrc(personDetails.profile_path, "persons")}
                layout="fullWidth"
                aspectRatio={2 / 3}
                alt={personDetails.name}
                background="auto"
                priority
                className="poster-img"
              />
            )}
          </figure>

          <section className="person-meta">
            <Title
              title={personDetails.name}
              variant="h1"
              size="lg"
              className="mobile-only-title"
            />

            <div className="meta-details">
              <p className="text-secondary meta-item métier">
                <Clapperboard size={18} aria-hidden />
                <span>
                  <strong>{departmentFr}</strong>
                </span>
              </p>

              <p className="text-secondary meta-item">
                <Cake size={18} aria-hidden />
                <span>
                  {dateFr} {ageString && `${ageString}`}
                </span>
              </p>

              {personDetails.place_of_birth && (
                <p className="text-secondary meta-item">
                  <MapPin size={18} aria-hidden />
                  <span>{personDetails.place_of_birth}</span>
                </p>
              )}
            </div>
          </section>
        </aside>

        <section className="person-main-content">
          <Title
            title={personDetails.name}
            variant="h1"
            size="xl"
            className="desktop-only-title"
          />
          <Tabs
            selected={selected}
            setSelected={setSelected}
            tabs={dynamicTabs}
            variant="transparent"
          />

          {selected === "details" && (
            <>
              <BiographyContainer
                personDetails={personDetails}
                personDetailsUS={personDetailsUS}
              />

              {popularWorks.length > 0 && (
                <section className="known-for-section">
                  <Title title="Connu pour" variant="h2" />
                  <ul className="person-movie-list known-for-list">
                    {popularWorks.map((movie: MovieType) => (
                      <li key={movie.id}>
                        <MovieCard movie={movie} size="sm" />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {selected === "actor" && renderMovieList(personCredits.cast)}

          {selected === "director" &&
            renderMovieList(
              personCredits.crew.filter(
                (m: { job: string }) => m.job === "Director",
              ),
            )}

          {selected === "writer" &&
            renderMovieList(
              personCredits.crew.filter((m: { job: string }) =>
                ["Story", "Screenplay", "Writer"].includes(m.job),
              ),
            )}

          {selected === "composer" &&
            renderMovieList(
              personCredits.crew.filter(
                (m: { job: string }) => m.job === "Original Music Composer",
              ),
            )}

          {selected === "photography" &&
            renderMovieList(
              personCredits.crew.filter(
                (m: { job: string }) => m.job === "Director of Photography",
              ),
            )}

          {selected === "editor" &&
            renderMovieList(
              personCredits.crew.filter(
                (m: { job: string }) => m.job === "Editor",
              ),
            )}

          {selected === "producer" &&
            renderMovieList(
              personCredits.crew.filter((m: { job: string }) =>
                ["Producer", "Executive Producer"].includes(m.job),
              ),
            )}
        </section>
      </article>
    </main>
  );
}
