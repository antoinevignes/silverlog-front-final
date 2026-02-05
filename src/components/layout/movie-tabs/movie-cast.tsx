import { movieCreditsQuery } from "@/queries/movie.queries";
import type { CastType } from "@/utils/types/cast";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";
import { CircleUser } from "lucide-react";

export default function MovieCast() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const {
    data: { cast },
  }: { data: { cast: CastType[] } } = useSuspenseQuery(
    movieCreditsQuery(movieId),
  );

  return (
    <HorizontalScroller className="cast-scroller">
      {cast.map((actor) => (
        <li key={actor.id} className="actor-crew-card">
          <Link to="/person/$personId" params={{ personId: String(actor.id) }}>
            <figure className="actor-crew-image">
              {!actor.profile_path ? (
                <div className="actor-poster-fallback">
                  <CircleUser size={32} aria-hidden color="#262626" />
                </div>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                  alt={`Image de ${actor.name}`}
                />
              )}
            </figure>

            <p className="actor-crew-details link">
              {actor.name} ({actor.character})
            </p>
          </Link>
        </li>
      ))}
    </HorizontalScroller>
  );
}
