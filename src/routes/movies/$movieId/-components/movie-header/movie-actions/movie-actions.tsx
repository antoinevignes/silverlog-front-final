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

  const handleOpen = () => {
    if (!user) {
      toast.error("Vous devez vous connecter");

      return navigate({
        to: "/auth/sign-in",
        search: { redirect: location.pathname },
      });
    }

    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={className}>
          <Plus size={20} />
          Noter, logger, ajouter à une liste
        </Button>
      </DialogTrigger>

      <DialogContent>
        <header className="dialog-header">
          <div className="dialog-movie-description">
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
          </div>

          <Bookmark size={24} />
        </header>

        <Rating />

        <div className="dialog-buttons">
          <Button variant="outline" size="sm">
            <Check size={16} /> Ajouter au journal
          </Button>

          <Button variant="outline" size="sm">
            <PenLine size={16} /> Écrire un avis
          </Button>

          <Button variant="outline" size="sm">
            <ListPlus size={16} /> Ajouter à une liste
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
