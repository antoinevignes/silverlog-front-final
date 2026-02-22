import { createFileRoute } from "@tanstack/react-router";
import "./diary.scss";
import ArticleTitle from "@/components/layout/section-title/article-title";
import { seenMoviesQuery } from "@/queries/user-movie.queries";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { MovieType } from "@/utils/types/movie";
import DiaryMobile from "@/components/layout/diary/diary-mobile";
import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DiaryDesktop from "@/components/layout/diary/diary-desktop";

type JournalItem = {
  movie_id: number;
  seen_at: string;
  rating: number;
};

export const Route = createFileRoute("/_authenticated/user/$userId/diary/")({
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    queryClient.ensureQueryData(seenMoviesQuery(userId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  const { data: journalItems, isLoading: isLoadingJournal } = useQuery(
    seenMoviesQuery(userId),
  );

  const movieDetailsResults = useQueries({
    queries: (journalItems ?? []).map((item: JournalItem) => ({
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
    })),
  });

  const groups = useMemo(() => {
    const movies = (
      movieDetailsResults.map((r) => r.data).filter(Boolean) as MovieType[]
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
  }, [movieDetailsResults]);

  const isLoading =
    isLoadingJournal || movieDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container diary-page">
      <ArticleTitle title="Journal" />

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="diary-content">
          {groups.map((group) => (
            <div key={group.id} className="diary-month-wrapper">
              <DiaryMobile month={group.label} movies={group.movies} />
              <DiaryDesktop monthDate={group.date} movies={group.movies} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
