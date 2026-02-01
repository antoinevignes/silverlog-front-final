import { movieCreditsQuery } from "@/queries/movie.queries";
import type { CrewType } from "@/utils/types/crew";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";

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
            <Link
              to="/person/$personId"
              params={{ personId: String(member.id) }}
            >
              <div className="actor-crew-image">
                <img
                  src={`https://image.tmdb.org/t/p/w200/${member.profile_path}`}
                  alt={`Image de ${member.name}`}
                />
              </div>

              <p className="actor-crew-details link">
                {member.name} ({member.job})
              </p>
            </Link>
          </li>
        ))}
      </HorizontalScroller>
    </>
  );
}
