import Skeleton from "@/components/ui/skeleton/skeleton";
import "./filtered-results.scss";

export default function FilteredResultsSkeletons() {
  return (
    <div className="filtered-results">
      <div className="results-grid">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} width={104} height={156} />
        ))}
      </div>
    </div>
  );
}
