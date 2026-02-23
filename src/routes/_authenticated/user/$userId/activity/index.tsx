import { useAuth } from "@/auth";
import TopList from "@/components/layout/activity/top-list/top-list";
import Watchlist from "@/components/layout/activity/watchlist/watchlist";
import { listDataQuery } from "@/queries/list.queries";
import type { MovieType } from "@/utils/types/movie";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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
  const { data: topListData, isLoading: isLoadingTopList } = useQuery(
    listDataQuery(user!.top_list_id!),
  );
  const { data: watchlistData, isLoading: isLoadingWatchlist } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );

  const topListMoviesDetailsResults = useQueries({
    queries: (topListData ?? []).map((item: any) => ({
      queryKey: ["movie", item.movie_id, "details", item.added_at],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
        );
        const details = await res.json();

        return details;
      },
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });

  const watchlistMoviesDetailsResults = useQueries({
    queries: (watchlistData ?? []).map((item: any) => ({
      queryKey: ["movie", item.movie_id, "details", item.added_at],
      queryFn: async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
        );
        const details = await res.json();

        return details;
      },
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });

  const topListMovies = topListMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const watchlistMovies = watchlistMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const isFetchingMovies =
    isLoadingTopList ||
    isLoadingWatchlist ||
    topListMoviesDetailsResults.some((r) => r.isLoading) ||
    watchlistMoviesDetailsResults.some((r) => r.isLoading);

  return (
    <>
      <TopList isFetchingMovies={isFetchingMovies} movies={topListMovies} />
      <Watchlist isFetchingMovies={isFetchingMovies} movies={watchlistMovies} />
    </>
  );
}
