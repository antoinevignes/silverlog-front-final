import "./watchlist.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import { useAuth } from "@/auth";
import { listDataQuery } from "@/features/list/api/list.queries";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import Badge from "@/components/ui/badge/badge";

export default function Watchlist() {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<number | "all">("all");

  const { user } = useAuth();
  const { data: listData } = useSuspenseQuery(
    listDataQuery(user!.watchlist_id),
  );

  const movies = listData.movies;

  // FILTRES
  const availableYears = useMemo(() => {
    if (!movies) return [];

    const years = new Set<string>();
    movies.forEach((m: { release_date: string }) => {
      if (m.release_date) {
        years.add(m.release_date.substring(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [movies]);

  const availableGenres = useMemo(() => {
    if (!movies) return [];

    const genreMap = new Map<number, string>();
    movies.forEach((m: { genres: Array<{ id: number; name: string }> }) => {
      m.genres.forEach((g) => {
        if (g.id && g.name) genreMap.set(g.id, g.name);
      });
    });
    return Array.from(genreMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [movies]);

  // TRI
  const filteredMovies = useMemo(() => {
    if (!movies) return [];

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
      const dateA = new Date(a.added_at || "").getTime();
      const dateB = new Date(b.added_at || "").getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [movies, selectedYear, selectedGenre, sortOrder]);

  return (
    <section className="watchlist-page">
      {movies.length > 0 ? (
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
    </section>
  );
}
