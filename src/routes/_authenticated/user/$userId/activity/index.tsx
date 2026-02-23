import { useAuth } from "@/auth";
import Diary from "@/components/layout/activity/diary/diary";
import Watchlist from "@/components/layout/activity/watchlist/watchlist";
import Tabs from "@/components/ui/tabs/tabs";
import { listDataQuery } from "@/queries/list.queries";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import type { MovieType } from "@/utils/types/movie";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";

const tabs = [
  { id: "watchlist", label: "Watchlist" },
  { id: "diary", label: "Journal" },
];

type JournalItem = {
  movie_id: number;
  seen_at: string;
  rating: number;
};

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
  const { user } = useAuth();

  const [selected, setSelected] = useState<string>("watchlist");

  const { data: watchlistData, isLoading: isLoadingWatchlist } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );
  const { data: journalItems, isLoading: isLoadingJournal } = useQuery(
    seenMoviesQuery(user!.id),
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

  const journalMoviesDetailsResults = useQueries({
    queries:
      selected === "diary"
        ? (journalItems ?? []).map((item: JournalItem) => ({
            queryKey: ["movie", item.movie_id, "details", item.rating],
            queryFn: async () => {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
              );
              const details = await res.json();

              return {
                ...details,
                seen_at: item.seen_at,
                personal_rating: item.rating,
              };
            },
            staleTime: 1000 * 60 * 60 * 24,
          }))
        : [],
  });

  const watchlistMovies = watchlistMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const groups = useMemo(() => {
    const movies = (
      journalMoviesDetailsResults
        .map((r) => r.data)
        .filter(Boolean) as MovieType[]
    ).sort(
      (a, b) => new Date(b.seen_at).getTime() - new Date(a.seen_at).getTime(),
    );

    const map = movies.reduce(
      (acc, movie) => {
        const date = new Date(movie.seen_at);
        const key = format(date, "yyyy-MM");
        if (!acc[key]) {
          acc[key] = {
            id: key,
            label: format(date, "MMMM yyyy", { locale: fr }),
            date: date,
            movies: [],
          };
        }
        acc[key].movies.push(movie);
        return acc;
      },
      {} as Record<
        string,
        { id: string; label: string; date: Date; movies: MovieType[] }
      >,
    );

    return Object.values(map);
  }, [journalMoviesDetailsResults]);

  const isFetchingMovies =
    selected === "watchlist"
      ? isLoadingWatchlist ||
        watchlistMoviesDetailsResults.some((r) => r.isLoading)
      : isLoadingJournal ||
        journalMoviesDetailsResults.some((r) => r.isLoading);

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

      {selected === "diary" && (
        <Diary isFetchingMovies={isFetchingMovies} groups={groups} />
      )}
    </>
  );
}
