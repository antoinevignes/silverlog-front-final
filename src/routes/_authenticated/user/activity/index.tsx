import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import Diary from "@/features/user/components/activity/diary/diary";
import Watchlist from "@/features/user/components/activity/watchlist/watchlist";
import Tabs from "@/components/ui/tabs/tabs";
import { listDataQuery } from "@/features/list/api/list.queries";
import { seenMoviesQuery } from "@/features/user/api/user-movie.queries";
import DiarySkeleton from "@/features/user/components/activity/diary/diary-skeleton/diary-skeleton";
import WatchlistSkeleton from "@/features/user/components/activity/watchlist/watchlist-skeleton/watchlist-skeleton";
import "./index.scss";
import Skeleton from "@/components/ui/skeleton/skeleton";
import Lists from "@/features/user/components/lists/lists";
import { useAuth } from "@/auth";

const tabs = [
  { id: "watchlist", label: "Watchlist" },
  { id: "diary", label: "Journal" },
  { id: "lists", label: "Listes" },
];

export const Route = createFileRoute("/_authenticated/user/activity/")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      listDataQuery(context.auth.user!.watchlist_id),
    );
    context.queryClient.prefetchQuery(seenMoviesQuery(context.auth.user!.id));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [selected, setSelected] = useState<string>("watchlist");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="container activity-page">
      <div className="activity-tabs-container">
        <Tabs
          selected={selected}
          setSelected={setSelected}
          tabs={tabs}
          variant={isDesktop ? "transparent" : "header"}
        />
      </div>

      {selected === "watchlist" && (
        <Suspense fallback={<WatchlistSkeleton />}>
          <Watchlist />
        </Suspense>
      )}

      {selected === "diary" && (
        <Suspense fallback={<DiarySkeleton />}>
          <Diary />
        </Suspense>
      )}

      {selected === "lists" && (
        <Suspense
          fallback={
            <div className="lists-skeleton-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="list-card-skeleton">
                  <div className="skeleton-info">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={24} width="30%" />
                    <Skeleton height={14} width="90%" />
                    <Skeleton height={14} width="60%" />
                    <Skeleton height={14} width="40%" />
                  </div>
                  <div className="skeleton-posters">
                    <Skeleton className="poster depth-2" />
                    <Skeleton className="poster depth-1" />
                    <Skeleton className="poster depth-0" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <Lists userId={user!.id} />
        </Suspense>
      )}
    </main>
  );
}
