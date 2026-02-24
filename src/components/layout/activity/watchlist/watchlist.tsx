import Skeleton from "@/components/ui/skeleton/skeleton";
import type { MovieType } from "@/utils/types/movie";
import "./watchlist.scss";
import MovieCard from "../../movie-card/movie-card";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { listDataQuery } from "@/queries/list.queries";
import { useState, useMemo } from "react";
import { ChevronDown, ArrowDownUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown-menu";
import Badge from "@/components/ui/badge/badge";

export default function Watchlist() {
  const { user } = useAuth();
  const { data: watchlistData, isLoading: isLoadingWatchlist } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );

  const watchlistMoviesDetailsResults = useQueries({
    queries: (watchlistData ?? []).map((item: any) => ({
      queryKey: ["movie", item.movie_id, "details", item.added_at],
      queryFn: async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/movie/${item.movie_id}?language=fr-FR`,
        );
        const details = await res.json();

        const movie = {
          ...details,
          added_at: item.added_at,
        };

        return movie;
      },
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });

  const movies = watchlistMoviesDetailsResults
    .map((r) => r.data)
    .filter(Boolean) as MovieType[];

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<number | "all">("all");

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    movies.forEach((m) => {
      if (m.release_date) {
        years.add(m.release_date.substring(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [movies]);

  const availableGenres = useMemo(() => {
    const genreMap = new Map<number, string>();
    movies.forEach((m) => {
      m.genres?.forEach((g) => {
        if (g.id && g.name) genreMap.set(g.id, g.name);
      });
    });
    return Array.from(genreMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (selectedYear !== "all") {
      result = result.filter(
        (m) => m.release_date && m.release_date.startsWith(selectedYear),
      );
    }

    if (selectedGenre !== "all") {
      result = result.filter(
        (m) => m.genres && m.genres.some((g) => g.id === selectedGenre),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date((a as any).added_at).getTime();
      const dateB = new Date((b as any).added_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [movies, selectedYear, selectedGenre, sortOrder]);

  const isFetchingMovies =
    isLoadingWatchlist ||
    watchlistMoviesDetailsResults.some((r) => r.isLoading);

  return (
    <main className="container watchlist-page">
      {isFetchingMovies ? (
        <WatchlistSkeleton />
      ) : movies.length > 0 ? (
        <>
          <header className="watchlist-filters">
            <DropdownMenu>
              <DropdownTrigger>
                <Badge variant="secondary" className="filter-badge" size="lg">
                  {selectedYear === "all" ? "Année" : selectedYear}
                  <ChevronDown size={14} />
                </Badge>
              </DropdownTrigger>
              <DropdownContent align="left">
                <DropdownItem onClick={() => setSelectedYear("all")}>
                  Toutes les années
                </DropdownItem>
                {availableYears.map((year) => (
                  <DropdownItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownTrigger>
                <Badge variant="secondary" className="filter-badge" size="lg">
                  {selectedGenre === "all"
                    ? "Genre"
                    : availableGenres.find(([id]) => id === selectedGenre)?.[1]}
                  <ChevronDown size={14} />
                </Badge>
              </DropdownTrigger>
              <DropdownContent align="left">
                <DropdownItem onClick={() => setSelectedGenre("all")}>
                  Tous les genres
                </DropdownItem>
                {availableGenres.map(([id, name]) => (
                  <DropdownItem key={id} onClick={() => setSelectedGenre(id)}>
                    {name}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </DropdownMenu>

            <Badge
              variant="secondary"
              className="filter-badge sort-badge"
              size="lg"
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
            >
              {sortOrder === "desc" ? "Trier : Récents" : "Trier : Anciens"}
              <ArrowDownUp size={14} />
            </Badge>
          </header>

          <section className="watchlist-layout">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard movie={movie} size="sm" key={movie.id} />
              ))
            ) : (
              <p className="empty-state" style={{ gridColumn: "1 / -1" }}>
                Aucun film ne correspond à vos filtres.
              </p>
            )}
          </section>
        </>
      ) : (
        <p className="empty-state">Votre watchlist est vide pour le moment.</p>
      )}
    </main>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="watchlist-layout">
      {Array.from({ length: 40 }).map((_, i) => (
        <Skeleton key={i} width="100%" className="watchlist-skeleton" />
      ))}
    </div>
  );
}
