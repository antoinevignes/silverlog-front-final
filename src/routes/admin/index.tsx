import { createFileRoute, redirect } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import {
  crewPicksQuery,
  movieSearchQuery,
} from "@/features/movie/api/movie.queries";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { Image } from "@unpic/react";
import Title from "@/components/ui/title/title";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { GripVertical, Search as SearchIcon, Shield } from "lucide-react";
import Tabs from "@/components/ui/tabs/tabs";
import Button from "@/components/ui/button/button";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import { useEffect, useState } from "react";
import { useUpdateCrewPicks } from "@/features/movie/api/movie.mutations";
import { useToggle } from "@/hooks/use-toggle";
import { z } from "zod";
import AdminStats from "../../features/admin/components/admin-stats";
import AdminUsers from "../../features/admin/components/admin-users";
import AdminReviews from "../../features/admin/components/admin-reviews";
import "./admin.scss";

const adminSearchSchema = z.object({
  tab: z.enum(["general", "reviews"]).catch("general").default("general"),
});

export const Route = createFileRoute("/admin/")({
  validateSearch: adminSearchSchema,
  beforeLoad: ({ context: { auth } }) => {
    if (auth.user?.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(crewPicksQuery());
  },
  component: Page,
});

function Page() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  const adminTabs = [
    { id: "general", label: "Général" },
    { id: "reviews", label: "Commentaires & Modération" },
  ];

  return (
    <main className="admin-container container">
      <header className="admin-header">
        <Shield size={32} />
        <Title title="Administration" variant="h1" size="xl" />
      </header>

      <div className="admin-tabs-wrapper">
        <Tabs
          selected={tab}
          setSelected={(id) =>
            navigate({ search: { tab: id as any }, replace: true })
          }
          tabs={adminTabs}
          variant="transparent"
        />
      </div>

      {tab === "general" && (
        <div className="admin-general-layout">
          <AdminStats />
          <CrewPicksEditor />
          <AdminUsers />
        </div>
      )}
      {tab === "reviews" && <AdminReviews />}
    </main>
  );
}

function CrewPicksEditor() {
  const { data: initialPicks } = useSuspenseQuery(crewPicksQuery());
  const [picks, setPicks] = useState(initialPicks || []);
  const { value: isEditing, toggle: toggleEditing, setFalse: stopEditing } = useToggle();
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
      picks.map((m: any) => m.id || m.movie_id),
      {
        onSuccess: () => stopEditing(),
      },
    );
  };

  return (
    <section className="admin-section">
      <div className="section-title-row">
        <Title title="Sélection de la rédaction" variant="h2" />
        <div className="actions">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={stopEditing}
              >
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

      <p className="text-secondary mb-lg">
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
                      className={`pick-item ${snapshot.isDragging ? "is-dragging" : ""}`}
                      style={provided.draggableProps.style}
                    >
                      <div className="draggable-card-wrapper">
                        {!isEditing && (
                          <div className="rank-badge font-sentient">
                            {index + 1}
                          </div>
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
                          className={`card-responsive ${isEditing ? "editing-mode" : ""}`}
                        >
                          <MovieCard
                            movie={movie}
                            size="md"
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

function CrewPickSearch({ onAdd }: { onAdd: (movie: any) => void }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery(movieSearchQuery(debouncedSearch));

  return (
    <div className="crew-pick-search-box mt-xl">
      <Title title="Rechercher un film à ajouter" className="mb-sm" />
      <div className="search-input-wrapper">
        <SearchIcon size={18} />
        <input
          type="text"
          placeholder="Titre du film..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && search && (
        <p className="text-secondary text-center py-md">
          Recherche en cours...
        </p>
      )}

      {data?.results && data.results.length > 0 && (
        <div className="search-results">
          {data.results.slice(0, 5).map((movie) => (
            <div key={movie.id} className="search-result-item">
              {movie.poster_path ? (
                <Image
                  src={getCloudinarySrc(movie.poster_path, "posters")}
                  width={40}
                  aspectRatio={2 / 3}
                  layout="constrained"
                  background="auto"
                  alt={`Affiche de ${movie.title}`}
                  className="poster-small"
                />
              ) : (
                <div className="poster-small bg-surface flex-center">
                  <span className="text-muted text-xs">Sans image</span>
                </div>
              )}
              <div className="movie-info">
                <span className="title truncate-1-line">{movie.title}</span>
                <span className="year">
                  {movie.release_date?.substring(0, 4)}
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  onAdd(movie);
                  setSearch("");
                }}
              >
                Ajouter
              </Button>
            </div>
          ))}
        </div>
      )}

      {data?.results && data.results.length === 0 && search && (
        <p className="text-secondary text-center py-md">
          Aucun film trouvé pour "{search}"
        </p>
      )}
    </div>
  );
}
