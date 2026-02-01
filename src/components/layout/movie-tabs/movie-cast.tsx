import { movieCreditsQuery } from "@/queries/movie.queries";
import type { CastType } from "@/utils/types/cast";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";

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
            <div className="actor-crew-image">
              <img
                src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                alt={`Image de ${actor.name}`}
              />
            </div>

            <p className="actor-crew-details link">
              {actor.name} ({actor.character})
            </p>
          </Link>
        </li>
      ))}
    </HorizontalScroller>
  );
}
