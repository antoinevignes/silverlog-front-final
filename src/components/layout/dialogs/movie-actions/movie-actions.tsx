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
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Check, ListPlus, PenLine, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ReviewDialog from "../review-dialog/review-dialog";
import DiaryDialog from "../diary-dialog/diary-dialog";

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
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<string>("main");

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
                  alt=""
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

              <Bookmark size={24} />
            </header>

            <Rating />

            <section className="dialog-buttons">
              <Button variant="outline" size="sm" onClick={goToDiary}>
                <Check size={16} /> Ajouter au journal
              </Button>

              <Button variant="outline" size="sm" onClick={goToReview}>
                <PenLine size={16} /> Écrire un avis
              </Button>

              <Button variant="outline" size="sm">
                <ListPlus size={16} /> Ajouter à une liste
              </Button>
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
      </DialogContent>
    </Dialog>
  );
}
