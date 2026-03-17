import { ArrowLeft, Globe, Lock } from "lucide-react";
import z from "zod";
import Button from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { useAppForm } from "@/utils/useAppForm";
import { useUpdateList } from "@/features/list/api/list.mutations";
import "./edit-list.scss";

interface EditListProps {
  listId: string;
  initialTitle: string;
  initialDescription: string;
  initialIsPublic: boolean;
  onSuccess: () => void;
  onBack: () => void;
}

export default function EditList({
  listId,
  initialTitle,
  initialDescription,
  initialIsPublic,
  onSuccess,
  onBack,
}: EditListProps) {
  const { mutate: updateList, isPending } = useUpdateList(listId);

  const form = useAppForm({
    defaultValues: {
      title: initialTitle,
      description: initialDescription || "",
      is_public: initialIsPublic,
    },
    validators: {
      onChange: z.object({
        title: z.string().trim().min(1).max(140),
        description: z.string().trim(),
        is_public: z.boolean(),
      }),
    },
    onSubmit: ({ value }) => {
      updateList(value, {
        onSuccess: () => {
          onSuccess();
        },
      });
    },
  });

  return (
    <div className="edit-list-container">
      <header className="dialog-header">
        <button
          className="back-button text-secondary"
          onClick={onBack}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="custom-list-title">Modifier la liste</h2>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="edit-list-form"
      >
        <div className="form-group">
          <Label htmlFor="edit-list-title">Nom de la liste</Label>
          <form.AppField
            name="title"
            children={(field) => (
              <field.Input
                id="edit-list-title"
                placeholder="Ex: Mes films préférés..."
              />
            )}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="edit-list-description">Description</Label>
          <form.AppField
            name="description"
            children={(field) => (
              <field.Textarea
                id="edit-list-description"
                placeholder="Une petite description..."
                rows={4}
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
          <Button variant="secondary" onClick={onBack} type="button">
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
                  {isPending ? "Enregistrement..." : "Enregistrer"}
                </form.Button>
              )}
            />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}
