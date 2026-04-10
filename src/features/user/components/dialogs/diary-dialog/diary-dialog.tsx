import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "@/components/ui/date-picker/date-picker.scss";
import "./diary-dialog.scss";
import z from "zod";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import type { MovieType } from "@/features/movie/types/movie";
import { useAppForm } from "@/utils/useAppForm";
import {
  useUpdateSeenDate,
  useRemoveFromDiary,
} from "@/features/user/api/user-movie.mutations";
import Button from "@/components/ui/button/button";

interface ReviewContentProps {
  onClose: () => void;
  onBack: () => void;
  movieId: string;
  movie: MovieType;
  initialDate?: string;
}

export default function DiaryDialog({
  onClose,
  onBack,
  movieId,
  movie,
  initialDate,
}: ReviewContentProps) {
  const { mutate: updateDate, isPending } = useUpdateSeenDate(movieId);
  const { mutate: removeFromDiary, isPending: isRemoving } =
    useRemoveFromDiary(movieId);

  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  const handleDelete = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    removeFromDiary(undefined, {
      onSuccess: () => onClose(),
    });
  };

  const hasSeen = !!initialDate;

  const form = useAppForm({
    defaultValues: {
      seen_at: initialDate ? new Date(initialDate) : new Date(),
    },
    validators: {
      onChange: z.object({
        seen_at: z.date("Veuillez choisir une date"),
      }),
    },
    onSubmit: ({ value }) => {
      if (!value.seen_at) return;

      updateDate(
        {
          seenDate: value.seen_at,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          releaseDate: movie.release_date,
          genres: movie.genres,
        },
        {
          onSuccess: () => onClose(),
        },
      );
    },
  });

  return (
    <section>
      <header className="diary-header">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </Button>

        <h2 className="diary-title">Ajouter au journal</h2>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="diary-dialog"
      >
        {hasSeen && (
          <p className="seen-date-display">
            <Clock size={16} /> Vu le{" "}
            {format(new Date(initialDate!), "d MMMM yyyy", {
              locale: frLocale,
            })}
          </p>
        )}

        <div className="date-picker-card">
          <form.AppField
            name="seen_at"
            children={(field) => (
              <DayPicker
                mode="single"
                selected={field.state.value}
                onSelect={(date) => {
                  if (date) field.setValue(date);
                }}
                defaultMonth={field.state.value}
                locale={fr}
                captionLayout="dropdown"
                animate
                fixedWeeks
                autoFocus
                disabled={{ after: new Date() }}
                endMonth={new Date()}
                navLayout="around"
              />
            )}
          />
        </div>

        <div className="diary-footer">
          {hasSeen && (
            <Button
              variant={isConfirming ? "destructive" : "ghost"}
              className={`delete-button ${isConfirming ? "confirm-mode" : ""}`}
              onClick={handleDelete}
              disabled={isRemoving}
            >
              {isRemoving ? (
                "..."
              ) : isConfirming ? (
                <>Confirmer ?</>
              ) : (
                <Trash2 size={18} />
              )}
            </Button>
          )}

          <div className="footer-actions">
            <Button variant="secondary" onClick={onBack}>
              Annuler
            </Button>

            <form.AppForm>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <form.Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isPending}
                  >
                    {isPending ? "Ajout en cours..." : "Ajouter"}
                  </form.Button>
                )}
              />
            </form.AppForm>
          </div>
        </div>
      </form>
    </section>
  );
}
