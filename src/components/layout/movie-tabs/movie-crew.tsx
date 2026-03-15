import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import { CircleUser } from "lucide-react";
import { Image } from "@unpic/react";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";
import type { CrewType } from "@/utils/types/crew";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import translateJob from "@/utils/translate-job";
import { movieCreditsQuery } from "@/queries/movie.queries";

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
  }: { data: { crew: Array<CrewType> } } = useSuspenseQuery(
    movieCreditsQuery(movieId),
  );

  const filteredCrew = useMemo(() => {
    const grouped = crew
      .filter((member) => MAJOR_JOBS.includes(member.job))
      .reduce(
        (acc, member) => {
          if (member.id in acc) {
            const existing = acc[member.id];
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
        {} as Record<number, CrewType & { allJobs: Array<string> }>,
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
        {filteredCrew.map((member) => {
          const posterSrc = getCloudinarySrc(member.profile_path, "persons");

          return (
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
                    <Image
                      src={posterSrc}
                      layout="fullWidth"
                      background="auto"
                      alt={`Image de ${member.name}`}
                      className="person-image"
                    />
                  )}
                </figure>

                <p className="actor-crew-details link">
                  {member.name} ({translateJob(member.job)})
                </p>
              </Link>
            </li>
          );
        })}
      </HorizontalScroller>
    </>
  );
}
