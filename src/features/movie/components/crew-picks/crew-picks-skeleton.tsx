import Skeleton from "@/components/ui/skeleton/skeleton";
import "./crew-picks.scss";

export default function CrewPicksSkeleton() {
  return (
    <div className="selection-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} width={136} height={204} />
      ))}
    </div>
  );
}
