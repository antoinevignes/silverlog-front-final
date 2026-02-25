import Skeleton from "@/components/ui/skeleton/skeleton";
import "./watchlist.scss";
import MovieCard from "../../movie-card/movie-card";
import { useQuery } from "@tanstack/react-query";
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
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<number | "all">("all");

  const { user } = useAuth();
  const { data: movies, isLoading } = useQuery(
    listDataQuery(user!.watchlist_id!),
  );

  console.log(movies);

  // FILTRES
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    movies.forEach((m: { release_date: string }) => {
      if (m.release_date) {
        years.add(m.release_date.substring(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [movies]);

  const availableGenres = useMemo(() => {
    const genreMap = new Map<number, string>();
    movies.forEach((m: { genres: { id: number; name: string }[] }) => {
      m.genres?.forEach((g) => {
        if (g.id && g.name) genreMap.set(g.id, g.name);
      });
    });
    return Array.from(genreMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [movies]);

  // TRI
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (selectedYear !== "all") {
      result = result.filter(
        (m) => m.release_date && m.release_date.startsWith(selectedYear),
      );
    }

    if (selectedGenre !== "all") {
      result = result.filter(
        (m) =>
          m.genres &&
          m.genres.some((g: { id: number }) => g.id === selectedGenre),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date((a as any).added_at).getTime();
      const dateB = new Date((b as any).added_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [movies, selectedYear, selectedGenre, sortOrder]);

  return (
    <main className="container watchlist-page">
      {isLoading ? (
        <WatchlistSkeleton />
      ) : movies.length > 0 ? (
        <>
          <header className="watchlist-filters">
            <DropdownMenu>
              <DropdownTrigger>
                <Badge variant="secondary" className="filter-badge" size="lg">
                  <span className="truncate">
                    {selectedYear === "all" ? "Année" : selectedYear}
                  </span>
                  <ChevronDown size={14} className="icon-shrink" />
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
                  <span className="truncate">
                    {selectedGenre === "all"
                      ? "Genre"
                      : availableGenres.find(
                          ([id]) => id === selectedGenre,
                        )?.[1]}
                  </span>
                  <ChevronDown size={14} className="icon-shrink" />
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
              <span className="truncate">
                {sortOrder === "desc" ? "Ajout : Récents" : "Ajout : Anciens"}
              </span>
              <ArrowDownUp size={14} className="icon-shrink" />
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
