import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import Diary from "@/features/user/components/activity/diary/diary";
import Watchlist from "@/features/user/components/activity/watchlist/watchlist";
import Tabs from "@/components/ui/tabs/tabs";
import { listDataQuery } from "@/features/list/api/list.queries";
import { seenMoviesQuery } from "@/features/user/api/user-movie.queries";
import DiarySkeleton from "@/features/user/components/activity/diary/diary-skeleton/diary-skeleton";
import WatchlistSkeleton from "@/features/user/components/activity/watchlist/watchlist-skeleton/watchlist-skeleton";
import "./index.scss";

const tabs = [
  { id: "watchlist", label: "Watchlist" },
  { id: "diary", label: "Journal" },
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
  const [selected, setSelected] = useState<string>("watchlist");

  return (
    <main className="container activity-page">
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={tabs}
        variant="header"
      />

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
    </main>
  );
}
