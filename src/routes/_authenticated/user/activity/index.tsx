import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import Diary from "@/components/layout/activity/diary/diary";
import Watchlist from "@/components/layout/activity/watchlist/watchlist";
import Tabs from "@/components/ui/tabs/tabs";
import { listDataQuery } from "@/queries/list.queries";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import DiarySkeleton from "@/components/layout/activity/diary/diary-skeleton/diary-skeleton";
import WatchlistSkeleton from "@/components/layout/activity/watchlist/watchlist-skeleton/watchlist-skeleton";

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
    <>
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
    </>
  );
}
