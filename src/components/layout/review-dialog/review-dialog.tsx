import "./review-dialog.scss";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import Rating from "@/components/layout/rating/rating";
import Button from "@/components/ui/button/button";
import { useAppForm } from "@/utils/useAppForm";
import z from "zod";
import { useDeleteReview, useUpsertReview } from "@/queries/review.mutations";
import { movieStateQuery } from "@/queries/user-movie.queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { movieReviewQuery } from "@/queries/review.query";
import { useAuth } from "@/auth";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { useEffect, useState } from "react";

interface ReviewContentProps {
  onClose: () => void;
  onBack: () => void;
  movieId: string;
}

export default function ReviewDialog({
  onClose,
  onBack,
  movieId,
}: ReviewContentProps) {
  const { user } = useAuth();

  const {
    data: { rating },
  } = useSuspenseQuery(movieStateQuery(String(movieId)));
  const { data: review, isLoading } = useQuery(movieReviewQuery(user, movieId));
  const { mutate: upsertReview, isPending } = useUpsertReview(movieId);

  const form = useAppForm({
    defaultValues: {
      content: review?.content || "",
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

  const [isConfirming, setIsConfirming] = useState(false);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(
    review?.id,
    movieId,
  );

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

    deleteReview(undefined, {
      onSuccess: () => {
        setIsConfirming(false);
        onClose();
      },
    });
  };

  return (
    <>
      <header className="review-dialog-header">
        <button
          className="back-button link"
          onClick={onBack}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="review-title">Écrire un avis</h2>
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
                {isLoading ? (
                  <Skeleton width="100%" height={115} />
                ) : (
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
              </>
            )}
          />

          <div className="dialog-footer">
            {review && (
              <Button
                type="button"
                variant={isConfirming ? "destructive" : "ghost"}
                className={`delete-button ${isConfirming ? "confirm-mode" : ""}`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  "..."
                ) : isConfirming ? (
                  <>Confirmer ?</>
                ) : (
                  <Trash2 size={18} />
                )}
              </Button>
            )}

            <div className="footer-actions">
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
          </div>
        </form>
      </section>
    </>
  );
}
