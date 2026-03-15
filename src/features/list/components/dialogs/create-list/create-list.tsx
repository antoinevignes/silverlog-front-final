import "./create-list.scss";
import { ArrowLeft, Globe, Lock } from "lucide-react";
import z from "zod";
import Button from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { useAppForm } from "@/utils/useAppForm";
import { useCreateList } from "@/features/list/api/list.mutations";

interface CreateListProps {
  onBack: () => void;
}

export default function CreateList({ onBack }: CreateListProps) {
  const { mutate: createList, isPending } = useCreateList();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      is_public: false,
    },
    validators: {
      onChange: z.object({
        title: z.string().trim().min(1).max(140),
        description: z.string().trim(),
        is_public: z.boolean(),
      }),
    },
    onSubmit: ({ value }) => {
      createList(value, {
        onSuccess: () => {
          onBack();
        },
      });
    },
  });

  return (
    <>
      <header className="dialog-header">
        <button
          className="back-button text-secondary"
          onClick={onBack}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="custom-list-title">Créer une liste</h2>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="create-list-form"
      >
        <div className="form-group">
          <Label htmlFor="list-title">Nom de la liste</Label>
          <form.AppField
            name="title"
            children={(field) => (
              <field.Input
                id="list-title"
                placeholder="Ex: Soirée Frissons, Films à voir en 2026..."
              />
            )}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="list-description">Description (optionnelle)</Label>
          <form.AppField
            name="description"
            children={(field) => (
              <field.Textarea
                id="list-description"
                placeholder="Un petit mot sur le thème de cette sélection..."
                rows={3}
              />
            )}
          />
        </div>

        <form.AppField
          name="is_public"
          children={(field) => {
            const isPublic = field.state.value;

            return (
              <div className="privacy-toggle-group">
                <div className="privacy-info">
                  <span className="privacy-label">Visibilité</span>
                  <span className="privacy-desc">
                    {isPublic
                      ? "Visible pour tous les utilisateurs du site."
                      : "Seul vous pourrez voir cette liste."}
                  </span>
                </div>

                <button
                  type="button"
                  className={`custom-switch ${isPublic ? "is-public" : "is-private"}`}
                  onClick={() => field.setValue(!isPublic)}
                  aria-checked={isPublic}
                  role="switch"
                >
                  <span className="switch-knob">
                    {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  </span>
                </button>
              </div>
            );
          }}
        />

        <div className="dialog-footer">
          <Button variant="secondary" onClick={onBack}>
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
                  {isPending ? "Création..." : "Créer"}
                </form.Button>
              )}
            />
          </form.AppForm>
        </div>
      </form>
    </>
  );
}
