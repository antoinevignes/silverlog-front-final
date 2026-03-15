import "./movie-actions.scss";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Bookmark, Check, ListPlus, PenLine, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TrophyIcon as TrophySolid } from "@heroicons/react/24/solid";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { Image } from "@unpic/react";
import DiaryDialog from "@/features/user/components/dialogs/diary-dialog/diary-dialog";
import ReviewDialog from "@/features/review/components/dialogs/review-dialog/review-dialog";
import CustomList from "@/features/list/components/dialogs/custom-list/custom-list";
import CreateList from "@/features/list/components/dialogs/create-list/create-list";
import type { MovieType } from "@/features/movie/types/movie";
import { movieStateQuery } from "@/features/user/api/user-movie.queries";
import { useToggleMovieList } from "@/features/list/api/list.mutations";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import Button from "@/components/ui/button/button";
import Rating from "@/features/movie/components/rating/rating";
import { useAuth } from "@/auth";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

export default function MovieActions({
  movie,
  movieYear,
  className,
}: {
  movie: MovieType;
  movieYear: number;
  className?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();

  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<string>("main");

  const { data: movieState } = useSuspenseQuery(movieStateQuery(movieId));
  const { mutate: toggleList, isPending } = useToggleMovieList(movieId);

  const isInTop = (movieState.lists ?? []).some(
    (list: { list_type: string }) => list.list_type === "top",
  );
  const isInWatchlist = (movieState.lists ?? []).some(
    (list: { list_type: string }) => list.list_type === "watchlist",
  );

  const handleOpen = (nextOpen: boolean) => {
    if (!user) {
      toast.error("Vous devez vous connecter");

      return navigate({
        to: "/auth/sign-in",
        search: { redirect: location.pathname },
      });
    }

    setOpen(nextOpen);
    if (nextOpen) {
      setCurrentView("main");
    }
  };

  const goBackToMain = () => setCurrentView("main");
  const goToReview = () => setCurrentView("review");
  const goToDiary = () => setCurrentView("diary");
  const goToCustomLists = () => setCurrentView("custom-list");
  const goToCreateList = () => setCurrentView("create-list");

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={className}>
          <Plus size={20} />
          Noter, logger, ajouter à une liste
        </Button>
      </DialogTrigger>

      <DialogContent>
        {currentView === "main" && (
          <>
            <header className="dialog-header">
              <section className="dialog-movie-description">
                <Image
                  src={getCloudinarySrc(movie.poster_path, "posters")}
                  layout="constrained"
                  width={45}
                  aspectRatio={2 / 3}
                  alt={`Affiche du film ${movie.title}`}
                  background="auto"
                  priority
                  className="dialog-image"
                />

                <div>
                  <h2 className="font-sentient">{movie.title}</h2>
                  <p className="text-secondary">
                    {!Number.isNaN(movieYear) ? movieYear : "NC"}
                  </p>
                </div>
              </section>

              <button
                className="watchlist-btn"
                disabled={isPending}
                onClick={() =>
                  toggleList({
                    type: "watchlist",
                    movieId,
                    title: movie.title,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    releaseDate: movie.release_date,
                    genres: movie.genres,
                  })
                }
              >
                <Bookmark fill={isInWatchlist ? "currentColor" : "none"} />
              </button>
            </header>

            <Rating
              title={movie.title}
              posterPath={movie.poster_path}
              backdropPath={movie.backdrop_path}
              releaseDate={movie.release_date}
              genres={movie.genres}
            />

            <section className="dialog-buttons">
              <button className="action-card" onClick={goToDiary}>
                <Check size={18} /> Ajouter au journal
              </button>

              <button className="action-card" onClick={goToReview}>
                <PenLine size={18} /> Écrire un avis
              </button>

              <button
                className="action-card"
                onClick={() =>
                  toggleList({
                    type: "top",
                    movieId,
                    title: movie.title,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    releaseDate: movie.release_date,
                    genres: movie.genres,
                  })
                }
                disabled={isPending}
              >
                {isInTop ? (
                  <TrophySolid width={20} aria-hidden className="toggled-svg" />
                ) : (
                  <TrophyIcon width={20} aria-hidden strokeWidth={2} />
                )}
                {isInTop ? "Dans mon top" : "Ajouter à mon top"}
              </button>

              <button className="action-card" onClick={goToCustomLists}>
                <ListPlus size={18} /> Ajouter à une liste
              </button>
            </section>
          </>
        )}

        {currentView === "review" && (
          <ReviewDialog
            onClose={() => setOpen(false)}
            onBack={goBackToMain}
            movieId={String(movie.id)}
            title={movie.title}
            posterPath={movie.poster_path}
            backdropPath={movie.backdrop_path}
            releaseDate={movie.release_date}
            genres={movie.genres}
          />
        )}

        {currentView === "diary" && (
          <DiaryDialog
            onClose={() => setOpen(false)}
            onBack={goBackToMain}
            movieId={String(movie.id)}
            movie={movie}
          />
        )}

        {currentView === "custom-list" && (
          <CustomList
            onBack={goBackToMain}
            onCreateNew={goToCreateList}
            movieId={movieId}
            movie={movie}
          />
        )}

        {currentView === "create-list" && (
          <CreateList onBack={goToCustomLists} />
        )}
      </DialogContent>
    </Dialog>
  );
}
