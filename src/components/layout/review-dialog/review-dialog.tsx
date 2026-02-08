import "./review-dialog.scss";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import Rating from "@/components/layout/rating/rating";
import Button from "@/components/ui/button/button";
import { useAppForm } from "@/utils/useAppForm";
import z from "zod";
import { useUpsertReview } from "@/queries/review.mutations";
import { movieStateQuery } from "@/queries/user-movie.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewContentProps {
  onClose: () => void;
  onBack: () => void;
  movieId: number;
}

export default function ReviewDialog({
  onClose,
  onBack,
  movieId,
}: ReviewContentProps) {
  const {
    data: { rating },
  } = useSuspenseQuery(movieStateQuery(String(movieId)));
  const { mutate: upsertReview, isPending } = useUpsertReview(movieId);

  const form = useAppForm({
    defaultValues: {
      content: "",
    },
    validators: {
      onChange: z.object({
        content: z.string().trim().min(1).max(140),
      }),
    },
    onSubmit: ({ value }) => {
      if (!rating) {
        toast.error("Vous devez donner une note au film");
        return;
      }

      upsertReview(value.content, {
        onSuccess: () => {
          onClose();
        },
      });
    },
  });

  return (
    <>
      <header className="review-dialog-header">
        <button className="back-button" onClick={onBack} aria-label="Retour">
          <ArrowLeft size={20} />
        </button>
      </header>

      <section className="review-content">
        <div className="rating-section">
          <Label>Ma note :</Label>
          <Rating />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="review-form"
        >
          <Label htmlFor="content">Ma critique :</Label>
          <form.AppField
            name="content"
            children={(field) => (
              <>
                <field.Textarea
                  id="content"
                  placeholder="Limite de 140 caractères..."
                  rows={4}
                />

                <span
                  className={`content-count ${field.state.value.length > 140 ? "error" : ""}`}
                >
                  {field.state.value.length}/140
                </span>
              </>
            )}
          />

          <div className="dialog-footer">
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
                    {isSubmitting ? "Publication..." : "Publier"}
                  </form.Button>
                )}
              />
            </form.AppForm>
          </div>
        </form>
      </section>
    </>
  );
}
