import "./movie-actions.scss";
import { useAuth } from "@/auth";
import Rating from "@/components/layout/rating/rating";
import Button from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import type { MovieType } from "@/utils/types/movie";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Bookmark, Check, ListPlus, PenLine, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ReviewDialog from "../review-dialog/review-dialog";
import DiaryDialog from "../diary-dialog/diary-dialog";
import { useToggleMovieList } from "@/queries/list.mutations";
import { useSuspenseQuery } from "@tanstack/react-query";
import { movieStateQuery } from "@/queries/user-movie.queries";
import { TrophyIcon as TrophySolid } from "@heroicons/react/24/solid";
import { TrophyIcon } from "@heroicons/react/24/outline";
import CustomList from "../custom-list/custom-list";
import CreateList from "../create-list/create-list";

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

  const isInTop = movieState.lists.some(
    (list: { list_type: string }) => list.list_type === "top",
  );
  const isInWatchlist = movieState.lists.some(
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
                <img
                  src={`https://image.tmdb.org/t/p/w45/${movie.poster_path}`}
                  alt={`Poster du film ${movie.title}`}
                  aria-hidden
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
                <Bookmark fill={isInWatchlist ? "#262626" : "none"} />
              </button>
            </header>

            <Rating />

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
          />
        )}

        {currentView === "diary" && (
          <DiaryDialog
            onClose={() => setOpen(false)}
            onBack={goBackToMain}
            movieId={String(movie.id)}
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
