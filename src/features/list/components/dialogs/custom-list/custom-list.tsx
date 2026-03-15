import "./custom-list.scss";
import { ArrowLeft, Check, Loader2, Plus } from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { MovieType } from "@/features/movie/types/movie";
import { useAuth } from "@/auth";
import { movieStateQuery } from "@/features/user/api/user-movie.queries";
import { customListsQuery } from "@/features/list/api/list.queries";
import { useToggleCustomList } from "@/features/list/api/list.mutations";

interface CustomListContentProps {
  onBack: () => void;
  onCreateNew: () => void;
  movieId: string;
  movie: MovieType;
}

export default function CustomList({
  onBack,
  onCreateNew,
  movieId,
  movie,
}: CustomListContentProps) {
  const { user } = useAuth();

  const { data: movieState } = useSuspenseQuery(movieStateQuery(movieId));
  const { data: customLists, isLoading } = useQuery(customListsQuery(user!.id));
  const { mutate: addToList, isPending } = useToggleCustomList(movieId);

  const isMovieInList = (listId: number) =>
    (movieState.lists ?? []).some((l: { id: number }) => l.id === listId);

  return (
    <>
      <header className="dialog-header">
        <button
          className="back-button text-secondary"
          onClick={onBack}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="custom-list-title">Ajouter à une liste</h2>
      </header>

      <section className="custom-lists-container">
        <button className="new-list-link" onClick={onCreateNew} type="button">
          <Plus size={16} />
          Créer une liste
        </button>

        <div className="custom-lists">
          {isLoading && (
            <div className="loading-state">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}

          {!isLoading && customLists?.length === 0 && (
            <div className="empty-state">
              <p>Vous n'avez pas encore de liste personnalisée.</p>
            </div>
          )}

          {!isLoading &&
            customLists &&
            customLists.map((list: { id: number; title: string }) => {
              const inList = isMovieInList(list.id);
              return (
                <button
                  key={list.id}
                  type="button"
                  className={`custom-list-item ${inList ? "selected" : ""}`}
                  onClick={() =>
                    addToList({
                      listId: list.id,
                      title: movie.title,
                      posterPath: movie.poster_path,
                      backdropPath: movie.backdrop_path,
                      releaseDate: movie.release_date,
                      genres: movie.genres,
                    })
                  }
                  disabled={isPending}
                >
                  <span>{list.title}</span>
                  {inList && <Check size={18} />}
                </button>
              );
            })}
        </div>
      </section>
    </>
  );
}
