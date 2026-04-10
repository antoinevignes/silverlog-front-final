import Skeleton from "@/components/ui/skeleton/skeleton";
import "./film-page-skeleton.scss";

export default function FilmPageSkeleton() {
  return (
    <div className="film-page-skeleton">
      <div className="film-page-skeleton__mobile gap-md">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="film-page-skeleton__tablet gap-sm">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="film-page-skeleton__desktop gap-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>
    </div>
  );
}
