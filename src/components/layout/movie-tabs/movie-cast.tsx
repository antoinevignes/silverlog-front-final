import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { CircleUser } from "lucide-react";
import { Image } from "@unpic/react";
import HorizontalScroller from "../horizontal-scroller/horizontal-scroller";
import type { CastType } from "@/utils/types/cast";
import { movieCreditsQuery } from "@/queries/movie.queries";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";

export default function MovieCast() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const {
    data: { cast },
  }: { data: { cast: Array<CastType> } } = useSuspenseQuery(
    movieCreditsQuery(movieId),
  );

  return (
    <HorizontalScroller className="cast-scroller">
      {cast.map((actor) => {
        const posterSrc = getCloudinarySrc(actor.profile_path, "persons");

        return (
          <li key={actor.id} className="actor-crew-card">
            <Link
              to="/person/$personId"
              params={{ personId: String(actor.id) }}
            >
              <figure className="actor-crew-image">
                {!actor.profile_path ? (
                  <div className="actor-poster-fallback">
                    <CircleUser size={32} aria-hidden color="#262626" />
                  </div>
                ) : (
                  <Image
                    src={posterSrc}
                    layout="fullWidth"
                    background={getCloudinaryPlaceholder(
                      actor.profile_path,
                      "persons",
                    )}
                    alt={`Image de ${actor.name}`}
                    className="person-image"
                  />
                )}
              </figure>

              <p className="actor-crew-details link">
                {actor.name} {actor.character && `(${actor.character})`}
              </p>
            </Link>
          </li>
        );
      })}
    </HorizontalScroller>
  );
}
