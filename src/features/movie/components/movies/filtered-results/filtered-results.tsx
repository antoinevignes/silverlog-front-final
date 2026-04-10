import type { MovieFilters } from "../movie-filters/movies-filters";
import { apiClient } from "@/utils/api-client";
import type { MovieType } from "../../../types/movie";
import MovieCard from "../../movie-card/movie-card";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import "./filtered-results.scss";
import Button from "@/components/ui/button/button";

export default function FilteredResults({
  filters,
}: {
  filters: MovieFilters;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["discover", "movies", filters],
      queryFn: async ({ pageParam = 1 }) => {
        const params: Record<string, string | number> = {
          page: pageParam,
          ...filters,
        };

        const response = await apiClient<{
          results: MovieType[];
          page: number;
          total_pages: number;
        }>("/tmdb/discover/movie", {
          params,
        });

        return response;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const allMovies = data?.pages.flatMap((page) => page.results) || [];

  if (allMovies.length === 0) {
    return (
      <div className="results-empty">
        <p className="text-secondary">
          Aucun film ne correspond à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="filtered-results">
      <div className="results-grid">
        {allMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="sm" />
        ))}
      </div>

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant="secondary"
          className="load-next-btn"
        >
          {isFetchingNextPage ? "Chargement..." : "Charger plus"}
        </Button>
      )}
    </div>
  );
}
