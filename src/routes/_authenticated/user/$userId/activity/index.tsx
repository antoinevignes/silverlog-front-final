import Diary from "@/components/layout/activity/diary/diary";
import Watchlist from "@/components/layout/activity/watchlist/watchlist";
import Tabs from "@/components/ui/tabs/tabs";
import { listDataQuery } from "@/queries/list.queries";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const tabs = [
  { id: "watchlist", label: "Watchlist" },
  { id: "diary", label: "Journal" },
];

export const Route = createFileRoute("/_authenticated/user/$userId/activity/")({
  loader: async ({ context, params: { userId } }) => {
    context.queryClient.ensureQueryData(
      listDataQuery(context.auth.user!.watchlist_id!),
    );
    context.queryClient.ensureQueryData(seenMoviesQuery(userId));
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

      {selected === "watchlist" && <Watchlist />}

      {selected === "diary" && <Diary />}
    </>
  );
}
