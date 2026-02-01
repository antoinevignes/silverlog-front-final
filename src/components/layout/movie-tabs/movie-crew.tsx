import { movieCreditsQuery } from "@/queries/movie.queries";
import type { CrewType } from "@/utils/types/crew";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";
import { CircleUser } from "lucide-react";

export default function MovieCrew() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const {
    data: { crew },
  }: { data: { crew: CrewType[] } } = useSuspenseQuery(
    movieCreditsQuery(movieId),
  );

  return (
    <>
      <HorizontalScroller className="cast-scroller">
        {crew.map((member) => (
          <li key={member.id} className="actor-crew-card">
            <figure className="actor-crew-image">
              {!member.profile_path ? (
                <div className="actor-poster-fallback">
                  <CircleUser size={32} aria-hidden color="#262626" />
                </div>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/w200/${member.profile_path}`}
                  alt={`Image de ${member.name}`}
                />
              )}
            </figure>

            <p className="actor-crew-details">
              {member.name} ({member.job})
            </p>
          </li>
        ))}
      </HorizontalScroller>
    </>
  );
}
