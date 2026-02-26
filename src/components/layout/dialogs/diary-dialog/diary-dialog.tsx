import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "../../../ui/date-picker/date-picker.scss";
import "./diary-dalog.scss";
import z from "zod";
import { ArrowLeft } from "lucide-react";
import type { MovieType } from "@/utils/types/movie";
import { useAppForm } from "@/utils/useAppForm";
import { useUpdateSeenDate } from "@/queries/user-movie.mutations";
import Button from "@/components/ui/button/button";

interface ReviewContentProps {
  onClose: () => void;
  onBack: () => void;
  movieId: string;
  movie: MovieType;
}

export default function DiaryDialog({
  onClose,
  onBack,
  movieId,
  movie,
}: ReviewContentProps) {
  const { mutate: updateDate, isPending } = useUpdateSeenDate(movieId);

  const form = useAppForm({
    defaultValues: {
      seen_at: new Date() as Date | undefined,
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
        <button
          className="back-button link"
          onClick={onBack}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="diary-title">Ajouter au journal</h2>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="diary-dialog"
      >
        <form.AppField
          name="seen_at"
          children={(field) => (
            <DayPicker
              mode="single"
              selected={field.state.value}
              onSelect={(date) => field.setValue(date)}
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

        <div className="diary-footer">
          <Button type="button" variant="secondary" onClick={onBack}>
            Annuler
          </Button>

          <form.AppForm>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isPristine,
              ]}
              children={([canSubmit, isSubmitting, isPristine]) => (
                <form.Button
                  type="submit"
                  disabled={
                    !canSubmit || isSubmitting || isPending || isPristine
                  }
                >
                  {isPending ? "Ajout en cours..." : "Ajouter"}
                </form.Button>
              )}
            />
          </form.AppForm>
        </div>
      </form>
    </section>
  );
}
