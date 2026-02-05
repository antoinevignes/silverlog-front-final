import { useAppForm } from "@/utils/useAppForm";
import "./search-bar.scss";
import z from "zod";
import { Film, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieSearchQuery } from "@/queries/movie.queries";
import { Card } from "@/components/ui/card";
import type { MovieType } from "@/utils/types/movie";
import { Link, useNavigate } from "@tanstack/react-router";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { personSearchQuery } from "@/queries/person.queries";
import type { PersonType } from "@/utils/types/person";

export default function SearchBar() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { data: movies, isLoading: isLoadingMovies } = useQuery(
    movieSearchQuery(searchQuery),
  );
  const { data: persons, isLoading: isLoadingPersons } = useQuery(
    personSearchQuery(searchQuery),
  );

  const allResults = useMemo(() => {
    const m = movies?.results || [];
    const p = persons?.results || [];

    return (
      [
        ...m.map((i: MovieType) => ({ ...i, type: "movie" })),
        ...p.map((i: PersonType) => ({ ...i, type: "person" })),
      ]
        // On trie TOUT par popularité, peu importe si c'est un film ou une personne
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 15)
    ); // On garde le top 15 mondial
  }, [movies, persons]);
  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  useEffect(() => {
    if (activeIndex !== -1 && scrollRef.current) {
      const activeElement = scrollRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!allResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < allResults.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && activeIndex !== -1) {
      e.preventDefault();
      const selected = allResults[activeIndex];
      const path =
        selected.type === "movie" ? "/movies/$movieId" : "/person/$personId";
      const params =
        selected.type === "movie"
          ? { movieId: String(selected.id) }
          : { personId: String(selected.id) };

      navigate({ to: path, params });
      setSearchQuery("");
    }
  };

  const form = useAppForm({
    defaultValues: {
      query: "",
    },
    listeners: {
      onChangeDebounceMs: 500,
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
    },
    validators: {
      onChange: z.object({
        query: z.string().trim(),
      }),
    },
    onSubmit: async ({ value }) => {
      setSearchQuery(value.query);
    },
  });

  return (
    <section className="search-bar">
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <form.AppField
          name="query"
          children={(field) => (
            <field.Input
              onKeyDown={handleKeyDown}
              placeholder="Rechercher un film..."
              leftIcon={<Search />}
              rightIcon={
                searchQuery && (
                  <X
                    className="delete-icon"
                    onClick={() => {
                      form.reset();
                      setSearchQuery("");
                    }}
                  />
                )
              }
            />
          )}
        />
      </form>

      {searchQuery && (
        <Card className="search-card">
          {isLoadingMovies || isLoadingPersons ? (
            <SearchCardSkeleton />
          ) : (
            <ul className="movie-results" ref={scrollRef}>
              {allResults.map((item, index) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    to={
                      item.type === "movie"
                        ? "/movies/$movieId"
                        : "/person/$personId"
                    }
                    params={
                      item.type === "movie"
                        ? { movieId: String(item.id) }
                        : { personId: String(item.id) }
                    }
                    className={`movie-result ${index === activeIndex ? "active" : ""}`}
                    onClick={() => setSearchQuery("")}
                  >
                    {/* Ton contenu (Image + Info) ici... */}
                    {!item.poster_path && !item.profile_path ? (
                      <div className="search-poster-fallback">
                        <Film />
                      </div>
                    ) : (
                      <img
                        src={`https://image.tmdb.org/t/p/w45/${item.poster_path || item.profile_path}`}
                        alt={item.title || item.name}
                      />
                    )}
                    <div className="movie-info">
                      <h2 className="font-sentient">
                        {item.title || item.name}
                      </h2>
                      {item.type === "movie" && (
                        <p className="text-secondary">
                          {item.release_date
                            ? new Date(item.release_date).getFullYear()
                            : "NC"}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </section>
  );
}

function SearchCardSkeleton() {
  return (
    <ul className="movie-results">
      {Array.from({ length: 20 }).map((_, index) => (
        <li className="movie-result">
          <Skeleton className="search-poster-fallback" />

          <div
            style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}
          >
            <Skeleton
              key={index}
              width="10rem"
              height={16}
              className="movie-title"
            />
            <Skeleton
              key={index}
              width="5rem"
              height={16}
              className="movie-title"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
