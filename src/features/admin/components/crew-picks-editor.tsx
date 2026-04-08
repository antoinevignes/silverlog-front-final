import Button from "@/components/ui/button/button";
import Title from "@/components/ui/title/title";
import { useUpdateCrewPicks } from "@/features/movie/api/movie.mutations";
import { crewPicksQuery } from "@/features/movie/api/movie.queries";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import useToggle from "@/utils/use-toggle";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import CrewPickSearch from "./crew-pick-search";

export default function CrewPicksEditor() {
  const { data: initialPicks } = useSuspenseQuery(crewPicksQuery());
  const [picks, setPicks] = useState(initialPicks || []);
  const {
    value: isEditing,
    toggle: toggleEditing,
    setFalse: stopEditing,
  } = useToggle();
  const { mutate, isPending } = useUpdateCrewPicks();

  useEffect(() => {
    if (!isEditing) {
      setPicks(initialPicks || []);
    }
  }, [initialPicks, isEditing]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(picks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPicks(items);
  };

  const handleRemove = (index: number) => {
    const items = Array.from(picks);
    items.splice(index, 1);
    setPicks(items);
  };

  const handleSave = () => {
    mutate(
      {
        movies: picks.map((m: any) => ({
          id: m.id || m.movie_id,
          title: m.title,
          poster_path: m.poster_path,
          backdrop_path: m.backdrop_path,
          release_date: m.release_date,
          genres: m.genres,
        })),
      },
      {
        onSuccess: () => stopEditing(),
      },
    );
  };

  return (
    <section className="admin-section">
      <div className="section-title-row">
        <Title title="Sélection de la rédaction" variant="h2" />
        <div className="section-title-row__actions">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={stopEditing}>
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                Enregistrer
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={toggleEditing}>
              Modifier la sélection
            </Button>
          )}
        </div>
      </div>

      <p className="section-title-row__description">
        Ces films apparaîtront directement sur la page d'accueil des visiteurs.
        Glissez pour réorganiser, cliquez sur la croix pour retirer.
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="admin-crew-picks" direction="horizontal">
          {(provided) => (
            <ul
              className="crew-picks-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {picks.map((movie: any, index: number) => (
                <Draggable
                  key={String(movie.id || movie.movie_id)}
                  draggableId={String(movie.id || movie.movie_id)}
                  index={index}
                  isDragDisabled={!isEditing}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`pick-item ${snapshot.isDragging ? "pick-item--dragging" : ""}`}
                      style={provided.draggableProps.style}
                    >
                      <div className="draggable-card-wrapper">
                        {!isEditing && (
                          <div className="rank-badge">{index + 1}</div>
                        )}
                        {isEditing && (
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                          >
                            <GripVertical size={16} color="white" />
                          </div>
                        )}
                        <div
                          className={`card-responsive ${isEditing ? "card-responsive--editing" : ""}`}
                        >
                          <MovieCard
                            movie={movie}
                            size="lg"
                            onRemove={
                              isEditing ? () => handleRemove(index) : undefined
                            }
                          />
                        </div>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {isEditing && picks.length < 6 && (
                <div className="add-movie-placeholder">
                  <span>
                    Recherchez un film ci-dessous pour l'ajouter. (
                    {picks.length}/6)
                  </span>
                </div>
              )}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {isEditing && picks.length < 6 && (
        <CrewPickSearch onAdd={(m) => setPicks([...picks, m])} />
      )}
    </section>
  );
}
