import Skeleton from "@/components/ui/skeleton/skeleton";
import "./public-lists.scss";

export default function PublicListsSkeleton() {
  return (
    <div className="public-lists-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} width="100%" height={200} />
      ))}
    </div>
  );
}
