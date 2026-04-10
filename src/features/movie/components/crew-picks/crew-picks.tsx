import { useSuspenseQuery } from "@tanstack/react-query";
import { BookmarkX } from "lucide-react";
import { crewPicksQuery } from "../../api/movie.queries";
import type { MovieType } from "../../types/movie";
import MovieCard from "../movie-card/movie-card";
import "./crew-picks.scss";

export default function CrewPicks() {
  const { data: crewPicks } = useSuspenseQuery(crewPicksQuery());

  if (crewPicks.length === 0) {
    return (
      <div className="crew-picks-empty">
        <BookmarkX size={48} />
        <p className="text-secondary">
          Aucune sélection de la rédaction pour le moment.
        </p>
      </div>
    );
  }

  return (
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
  );
}
