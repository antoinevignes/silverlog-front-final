import z from "zod";
import { Film, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { MovieType } from "@/features/movie/types/movie";
import type { PersonType } from "@/features/movie/types/person";
import type { UserType } from "@/features/user/types/user";
import { useAppForm } from "@/utils/useAppForm";
import "./search-bar.scss";
import { movieSearchQuery } from "@/features/movie/api/movie.queries";
import { Card } from "@/components/ui/card/card";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { personSearchQuery } from "@/features/movie/api/person.queries";
import { userSearchQuery } from "@/features/user/api/user.queries";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

type SearchResultItem =
  | (MovieType & { type: "movie" })
  | (PersonType & { type: "person" })
  | (UserType & { type: "user" });

export default function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { data: movies, isLoading: isLoadingMovies } = useQuery(
    movieSearchQuery(searchQuery),
  );
  const { data: persons, isLoading: isLoadingPersons } = useQuery(
    personSearchQuery(searchQuery),
  );
  const { data: users, isLoading: isLoadingUsers } = useQuery(
    userSearchQuery(searchQuery),
  );

  const allResults = useMemo((): SearchResultItem[] => {
    const m = movies?.results || [];
    const p = persons?.results || [];
    const u = users || [];

    return [
      ...m.map((i: MovieType) => ({ ...i, type: "movie" as const })),
      ...p.map((i: PersonType) => ({ ...i, type: "person" as const })),
      ...u.map((i: UserType) => ({ ...i, type: "user" as const })),
    ]
      .sort((a, b) => {
        const popA = (a as any).popularity || (a as any).followers_count || 0;
        const popB = (b as any).popularity || (b as any).followers_count || 0;
        return popB - popA;
      })
      .slice(0, 15);
  }, [movies, persons, users]);

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
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex !== -1) {
        const selected = allResults[activeIndex];
        let path: string = "";
        let params: any = {};

        if (selected.type === "movie") {
          path = "/movies/$movieId";
          params = { movieId: String(selected.id) };
        } else if (selected.type === "person") {
          path = "/person/$personId";
          params = { personId: String(selected.id) };
        } else if (selected.type === "user") {
          path = "/user/$userId";
          params = { userId: String(selected.id) };
        }

        navigate({ to: path as any, params });
        setSearchQuery("");
      } else if (searchQuery.trim()) {
        navigate({
          to: "/search",
          search: { q: searchQuery.trim() },
        });
        setSearchQuery("");
      }
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
              aria-label="Barre de recherche"
              leftIcon={<Search />}
              autoFocus={autoFocus}
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
          {isLoadingMovies || isLoadingPersons || isLoadingUsers ? (
            <SearchCardSkeleton />
          ) : (
            <ul className="movie-results" ref={scrollRef}>
              {allResults.map((item, index) => {
                const anyItem = item as any;
                const posterSrc = getCloudinarySrc(
                  anyItem?.poster_path ||
                    anyItem?.profile_path ||
                    anyItem?.avatar_path,
                  item.type === "user" ? "avatars" : "posters",
                );

                return (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      to={
                        item.type === "movie"
                          ? "/movies/$movieId"
                          : item.type === "person"
                            ? "/person/$personId"
                            : "/user/$userId"
                      }
                      params={
                        item.type === "movie"
                          ? { movieId: String(item.id) }
                          : item.type === "person"
                            ? { personId: String(item.id) }
                            : { userId: String(item.id) }
                      }
                      className={`movie-result ${index === activeIndex ? "active" : ""}`}
                      onClick={() => setSearchQuery("")}
                    >
                      {!anyItem.poster_path &&
                      !anyItem.profile_path &&
                      !anyItem.avatar_path ? (
                        <div
                          className={`search-poster-fallback text-secondary ${item.type === "person" || item.type === "user" ? "is-person" : ""}`}
                        >
                          {item.type === "user" ? <User /> : <Film />}
                        </div>
                      ) : (
                        <Image
                          src={posterSrc}
                          width={
                            item.type === "person" || item.type === "user"
                              ? 40
                              : 45
                          }
                          aspectRatio={
                            item.type === "person" || item.type === "user"
                              ? 1
                              : 2 / 3
                          }
                          alt={
                            anyItem.title || anyItem.name || anyItem.username
                          }
                          background="auto"
                          className={`search-poster ${item.type === "person" || item.type === "user" ? "is-person" : ""}`}
                        />
                      )}
                      <div className="movie-info">
                        <h2 className="font-fraunces">
                          {anyItem.title || anyItem.name || anyItem.username}
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

          <div className="movie-info">
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
