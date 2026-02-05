import { movieCreditsQuery } from "@/queries/movie.queries";
import type { CrewType } from "@/utils/types/crew";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";
import { useMemo } from "react";
import translateJob from "@/utils/translate-job";
import { CircleUser } from "lucide-react";

const MAJOR_JOBS = [
  "Director",
  "Screenplay",
  "Producer",
  "Executive Producer",
  "Director of Photography",
  "Original Music Composer",
  "Editor",
];

export default function MovieCrew() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const {
    data: { crew },
  }: { data: { crew: CrewType[] } } = useSuspenseQuery(
    movieCreditsQuery(movieId),
  );

  const filteredCrew = useMemo(() => {
    if (!crew) return [];

    const grouped = crew
      .filter((member) => MAJOR_JOBS.includes(member.job))
      .reduce(
        (acc, member) => {
          const existing = acc[member.id];

          if (existing) {
            if (!existing.allJobs.includes(member.job)) {
              existing.allJobs.push(member.job);
            }
          } else {
            acc[member.id] = {
              ...member,
              allJobs: [member.job],
            };
          }
          return acc;
        },
        {} as Record<number, CrewType & { allJobs: string[] }>,
      );

    return Object.values(grouped)
      .sort((a, b) => {
        const aIsDirector = a.allJobs.includes("Director");
        const bIsDirector = b.allJobs.includes("Director");
        if (aIsDirector && !bIsDirector) return -1;
        if (!aIsDirector && bIsDirector) return 1;
        return 0;
      })
      .slice(0, 20);
  }, [crew]);

  return (
    <>
      <HorizontalScroller className="cast-scroller">
        {filteredCrew.map((member) => (
          <li key={`${member.id}-${member.job}`} className="actor-crew-card">
            <Link
              to="/person/$personId"
              params={{ personId: String(member.id) }}
            >
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

              <p className="actor-crew-details link">
                {member.name} ({translateJob(member.job)})
              </p>
            </Link>
          </li>
        ))}
      </HorizontalScroller>
    </>
  );
}
