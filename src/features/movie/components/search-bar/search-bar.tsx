import z from "zod";
import { Film, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { MovieType } from "@/features/movie/types/movie";
import type { PersonType } from "@/features/movie/types/person";
import { useAppForm } from "@/utils/useAppForm";
import "./search-bar.scss";
import { movieSearchQuery } from "@/features/movie/api/movie.queries";
import { Card } from "@/components/ui/card/card";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { personSearchQuery } from "@/features/movie/api/person.queries";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

type SearchResultItem =
  | (MovieType & { type: "movie" })
  | (PersonType & { type: "person" });

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

  const allResults = useMemo((): SearchResultItem[] => {
    const m = movies?.results || [];
    const p = persons?.results || [];

    return [
      ...m.map((i: MovieType) => ({ ...i, type: "movie" as const })),
      ...p.map((i: PersonType) => ({ ...i, type: "person" as const })),
    ]
      .sort((a, b) => ((b as any).popularity || 0) - ((a as any).popularity || 0))
      .slice(0, 15);
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
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
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
    onSubmit: ({ value }) => {
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
              {allResults.map((item, index) => {
                const anyItem = item as any;
                const posterSrc = getCloudinarySrc(
                  anyItem?.poster_path || anyItem?.profile_path,
                  "posters",
                );

                return (
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
                      {!anyItem.poster_path && !anyItem.profile_path ? (
                        <div className="search-poster-fallback text-secondary">
                          <Film />
                        </div>
                      ) : (
                        <Image
                          src={posterSrc}
                          width={45}
                          aspectRatio={2 / 3}
                          alt={anyItem.title || anyItem.name}
                          background="auto"
                          className="search-poster"
                        />
                      )}
                      <div className="movie-info">
                        <h2 className="font-sentient">
                          {anyItem.title || anyItem.name}
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
                );
              })}
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
