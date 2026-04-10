import Skeleton from "@/components/ui/skeleton/skeleton";
import "./film-page-skeleton.scss";

export default function FilmPageSkeleton() {
  return (
    <div className="film-page-skeleton">
      <div className="film-page-skeleton__mobile">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="film-page-skeleton__tablet">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="film-page-skeleton__desktop">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>
    </div>
  );
}
