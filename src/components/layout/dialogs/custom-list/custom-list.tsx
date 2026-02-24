import "./custom-list.scss";
import { useAuth } from "@/auth";
import { ArrowLeft, Check, Plus, Loader2 } from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { movieStateQuery } from "@/queries/user-movie.queries";
import { customListsQuery } from "@/queries/list.queries";
import { useToggleCustomList } from "@/queries/list.mutations";

interface CustomListContentProps {
  onBack: () => void;
  movieId: string;
}

export default function CustomList({
  onBack,
  movieId,
}: CustomListContentProps) {
  const { user } = useAuth();

  const { data: movieState } = useSuspenseQuery(movieStateQuery(movieId));
  const { data: customLists, isLoading } = useQuery(customListsQuery(user!.id));
  const { mutate: addToList, isPending } = useToggleCustomList(movieId);

  const isMovieInList = (listId: number) =>
    movieState.lists.some((l: any) => l.id === listId);

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
        <Link to="/" className="underline-link new-list-link">
          <Plus size={16} />
          Créer une liste
        </Link>

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
                  onClick={() => addToList({ listId: list.id })}
                  disabled={isPending}
                >
                  {inList && <Check size={16} />}
                  {list.title}
                </button>
              );
            })}
        </div>
      </section>
    </>
  );
}
