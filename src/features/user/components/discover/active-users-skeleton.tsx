import Skeleton from "@/components/ui/skeleton/skeleton";
import "./active-users.scss";

export default function ActiveUsersSkeleton() {
  return (
    <div className="active-users-list">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} width="100%" height={78} />
      ))}
    </div>
  );
}
