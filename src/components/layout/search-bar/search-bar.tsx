import { useAppForm } from "@/utils/useAppForm";
import "./search-bar.scss";
import z from "zod";
import { Film, Search, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieSearchQuery } from "@/queries/movie.queries";
import { Card } from "@/components/ui/card";
import type { MovieType } from "@/utils/types/movie";
import { Link } from "@tanstack/react-router";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { personSearchQuery } from "@/queries/person.queries";
import type { PersonType } from "@/utils/types/person";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: movies, isLoading: isLoadingMovies } = useQuery(
    movieSearchQuery(searchQuery),
  );
  const { data: persons, isLoading: isLoadingPersons } = useQuery(
    personSearchQuery(searchQuery),
  );

  console.log(persons);

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
            <ul className="movie-results">
              {movies?.results.map((movie: MovieType) => (
                <li>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="movie-result"
                  >
                    {!movie.poster_path ? (
                      <div className="search-poster-fallback">
                        <Film aria-hidden color="#262626" />
                      </div>
                    ) : (
                      <img
                        src={`https://image.tmdb.org/t/p/w45/${movie.poster_path}`}
                        alt={`Poster du film ${movie.title}`}
                      />
                    )}

                    <div className="movie-info">
                      <h2 className="font-sentient">{movie.title}</h2>
                      <p className="text-secondary">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : "NC"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}

              {persons?.results.map((person: PersonType) => (
                <li>
                  <Link
                    to="/person/$personId"
                    params={{ personId: String(person.id) }}
                    className="movie-result"
                  >
                    {!person.profile_path ? (
                      <div className="search-poster-fallback">
                        <Film aria-hidden color="#262626" />
                      </div>
                    ) : (
                      <img
                        src={`https://image.tmdb.org/t/p/w45/${person.profile_path}`}
                        alt={`Photo de ${person.name}`}
                      />
                    )}

                    <div className="movie-info">
                      <h2 className="font-sentient">{person.name}</h2>
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
