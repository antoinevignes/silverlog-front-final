import Skeleton from "@/components/ui/skeleton/skeleton";
import "./crew-picks-skeleton.scss";

export default function CrewPicksSkeleton() {
  return (
    <>
      <div className="selection-grid-skeleton__mobile">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>

      <div className="selection-grid-skeleton__desktop">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={136} height={204} />
        ))}
      </div>
    </>
  );
}
