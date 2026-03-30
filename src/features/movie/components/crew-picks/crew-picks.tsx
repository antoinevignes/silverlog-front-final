import Title from "@/components/ui/title/title";
import { useSuspenseQuery } from "@tanstack/react-query";
import { crewPicksQuery } from "../../api/movie.queries";
import type { MovieType } from "../../types/movie";
import MovieCard from "../movie-card/movie-card";
import "./crew-picks.scss";

export default function CrewPicks() {
  const { data: crewPicks } = useSuspenseQuery(crewPicksQuery());
  return (
    <section className="container selection-section">
      <Title title="La sélection de la rédaction" />

      <ul className="selection-grid">
        {crewPicks.map((movie: MovieType) => (
          <>
            <li key={movie.id} className="card-mobile">
              <MovieCard movie={movie} size="sm" />
            </li>
            <li className="card-desktop">
              <MovieCard movie={movie} size="md" />
            </li>
          </>
        ))}
      </ul>
    </section>
  );
}
