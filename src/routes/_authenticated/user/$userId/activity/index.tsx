import { useAuth } from "@/auth";
import TopList from "@/components/layout/activity/top-list/top-list";
import Watchlist from "@/components/layout/activity/watchlist/watchlist";
import Tabs from "@/components/ui/tabs/tabs";
import { listDataQuery } from "@/queries/list.queries";
import type { MovieType } from "@/utils/types/movie";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const tabs = [
  { id: "watchlist", label: "Watchlist" },
  { id: "top-list", label: "Mon Top" },
];

export const Route = createFileRoute("/_authenticated/user/$userId/activity/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(
      listDataQuery(context.auth.user!.top_list_id!),
    );
    context.queryClient.ensureQueryData(
      listDataQuery(context.auth.user!.watchlist_id!),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [selected, setSelected] = useState<string>("watchlist");

  const { data: watchlistData, isLoading: isLoadingWatchlist } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );

  const { data: topListData, isLoading: isLoadingTopList } = useQuery(
    listDataQuery(user!.top_list_id!),
  );

  const watchlistMoviesDetailsResults = useQueries({
    queries:
      selected === "watchlist"
        ? (watchlistData ?? []).map((item: any) => ({
            queryKey: ["movie", item.movie_id, "details", item.added_at],
            queryFn: async () => {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
              );
              const details = await res.json();

              return details;
            },
            staleTime: 1000 * 60 * 60 * 24,
          }))
        : [],
  });

  const topListMoviesDetailsResults = useQueries({
    queries:
      selected === "top-list"
        ? (topListData ?? []).map((item: any) => ({
            queryKey: ["movie", item.movie_id, "details", item.added_at],
            queryFn: async () => {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
              );
              const details = await res.json();

              return details;
            },
            staleTime: 1000 * 60 * 60 * 24,
          }))
        : [],
  });

  const watchlistMovies = watchlistMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const topListMovies = topListMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const isFetchingMovies =
    selected === "watchlist"
      ? isLoadingWatchlist ||
        watchlistMoviesDetailsResults.some((r) => r.isLoading)
      : isLoadingTopList ||
        topListMoviesDetailsResults.some((r) => r.isLoading);

  return (
    <>
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={tabs}
        variant="header"
      />

      {selected === "watchlist" && (
        <Watchlist
          isFetchingMovies={isFetchingMovies}
          movies={watchlistMovies}
        />
      )}

      {selected === "top-list" && (
        <TopList isFetchingMovies={isFetchingMovies} movies={topListMovies} />
      )}
    </>
  );
}
