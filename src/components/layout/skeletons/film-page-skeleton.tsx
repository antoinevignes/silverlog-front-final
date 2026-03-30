import Skeleton from "@/components/ui/skeleton/skeleton";
import "./film-page-skeleton.scss";

export default function FilmPageSkeleton() {
  return (
    <div className="film-page-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} width={104} height={156} />
      ))}
    </div>
  );
}
