import Skeleton from "@/components/ui/skeleton/skeleton";
import "./popular-movies-skeleton.scss";

export default function PopularMoviesLgSkeletons() {
  return (
    <div className="popular-movies-skeletons">
      <div className="popular-movies-skeletons__mobile">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="popular-movies-skeletons__tablet">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="popular-movies-skeletons__desktop">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>
    </div>
  );
}
