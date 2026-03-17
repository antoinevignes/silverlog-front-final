import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, Trash2, User, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/auth";
import {
  useUpdateLocation,
  useUpdateUsername,
  useUploadAvatar,
  useDeleteAccount,
  useDeleteAvatar,
  useUploadBanner,
  useDeleteBanner,
} from "@/features/user/api/user.mutations";
import Title from "@/components/ui/title/title";
import "./settings.scss";
import { useAppForm } from "@/utils/useAppForm";
import z from "zod";
import Button from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import ImageUploadSection from "@/components/ui/image-upload-section/image-upload-section";

export const Route = createFileRoute("/_authenticated/user/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();
  const { mutate: updateUsername, isPending: isUpdatingUsername } =
    useUpdateUsername();
  const { mutate: updateLocation, isPending: isUpdatingLocation } =
    useUpdateLocation();

  // MAJ AVATAR
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatar();
  const { mutate: deleteAvatar, isPending: isDeletingAvatar } =
    useDeleteAvatar();

  // MAJ BACKDROP
  const { mutate: uploadBackdrop, isPending: isUploadingBackdrop } =
    useUploadBanner();
  const { mutate: deleteBackdrop, isPending: isDeletingBackdrop } =
    useDeleteBanner();

  // MAJ PSEUDO
  const usernameForm = useAppForm({
    defaultValues: {
      username: user?.username ?? "",
    },
    validators: {
      onChange: z.object({
        username: z.string().trim().min(1).max(140),
      }),
    },
    onSubmit: ({ value }) => {
      updateUsername(value.username);
    },
  });

  // MAJ LOCALISATION
  const locationForm = useAppForm({
    defaultValues: {
      location: "",
    },
    validators: {
      onChange: z.object({
        location: z.string().trim().min(1).max(140),
      }),
    },
    onSubmit: ({ value }) => {
      updateLocation(value.location);
    },
  });

  return (
    <main className="settings-page container">
      <header className="settings-header">
        <Title title="Paramètres" variant="h1" size="lg" />
        <p className="text-secondary">Gérez votre profil et vos préférences.</p>
      </header>

      <section className="settings-body">
        {/* USERNAME */}
        <SettingSection
          icon={<User size={20} />}
          title="Nom d'utilisateur"
          description="Votre nom public sur Silverlog. Visible de tous les membres."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              usernameForm.handleSubmit();
            }}
            className="setting-form"
          >
            <usernameForm.AppField
              name="username"
              children={(field) => (
                <field.Input id="username" placeholder="Nom d'utilisateur" />
              )}
            />

            <usernameForm.AppForm>
              <usernameForm.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isPristine,
                ]}
                children={([canSubmit, isSubmitting, isPristine]) => (
                  <usernameForm.Button
                    type="submit"
                    size="sm"
                    disabled={
                      !canSubmit ||
                      isSubmitting ||
                      isUpdatingUsername ||
                      isPristine
                    }
                  >
                    {isUpdatingUsername ? "Mise à jour..." : "Mettre à jour"}
                  </usernameForm.Button>
                )}
              />
            </usernameForm.AppForm>
          </form>
        </SettingSection>

        {/* LOCALISATION */}
        <SettingSection
          icon={<MapPin size={20} />}
          title="Localisation"
          description="Votre ville ou pays, affiché sur votre profil."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              locationForm.handleSubmit();
            }}
            className="setting-form"
          >
            <locationForm.AppField
              name="location"
              children={(field) => (
                <field.Input id="location" placeholder="Localisation" />
              )}
            />

            <locationForm.AppForm>
              <locationForm.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isPristine,
                ]}
                children={([canSubmit, isSubmitting, isPristine]) => (
                  <locationForm.Button
                    type="submit"
                    size="sm"
                    disabled={
                      !canSubmit ||
                      isSubmitting ||
                      isUpdatingLocation ||
                      isPristine
                    }
                  >
                    {isUpdatingLocation ? "Mise à jour..." : "Mettre à jour"}
                  </locationForm.Button>
                )}
              />
            </locationForm.AppForm>
          </form>
        </SettingSection>

        {/* AVATAR */}
        <SettingSection
          icon={<Camera size={20} />}
          title="Avatar"
          description="Photo de profil affichée sur votre page et dans vos commentaires."
        >
          <ImageUploadSection
            currentPath={user?.avatar_path ?? null}
            folder="avatars"
            altText={`Avatar de ${user?.username}`}
            placeholder={
              <span className="avatar-placeholder">
                <User size={28} aria-hidden />
              </span>
            }
            uploadZoneClassName="avatar-upload-zone"
            formClassName="setting-form avatar-form"
            previewClassName="avatar-preview-img"
            currentClassName="avatar"
            onUpload={uploadAvatar}
            isUploading={isUploadingAvatar}
            onDelete={deleteAvatar}
            isDeleting={isDeletingAvatar}
            previewWidth={40}
            previewHeight={40}
            inputAriaLabel="Choisir une photo de profil"
            deleteAriaLabel="Supprimer la photo de profil"
          />
        </SettingSection>

        {/* BACKDROP */}
        <SettingSection
          icon={<ImageIcon size={20} />}
          title="Bannière"
          description="Image de fond affichée sur votre page de profil."
        >
          <ImageUploadSection
            currentPath={user?.banner_path ?? null}
            folder="banners"
            altText={`Bannière de ${user?.username}`}
            placeholder={
              <span className="banner-placeholder">
                <ImageIcon size={28} aria-hidden />
              </span>
            }
            uploadZoneClassName="banner-upload-zone"
            formClassName="setting-form banner-form"
            previewClassName="banner-preview-img"
            currentClassName="banner-img"
            onUpload={uploadBackdrop}
            isUploading={isUploadingBackdrop}
            onDelete={deleteBackdrop}
            isDeleting={isDeletingBackdrop}
            previewWidth={160}
            previewHeight={90}
            inputAriaLabel="Choisir une bannière"
            deleteAriaLabel="Supprimer la bannière"
          />
        </SettingSection>

        {/* SUPPRIMER LE COMPTE */}
        <SettingSection
          icon={<Trash2 size={20} />}
          title="Supprimer le compte"
          description="Supprime votre compte et toutes ses données."
        >
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="delete-btn"
          >
            Supprimer le compte
          </Button>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <h2 className="delete-dialog-title">Confirmer la suppression</h2>
              <p className="text-secondary delete-dialog-desc">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                est irréversible et toutes vos données seront perdues.
              </p>

              <DialogFooter>
                <div className="delete-dialog-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeletingAccount}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteAccount()}
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount
                      ? "Suppression..."
                      : "Confirmer la suppression"}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SettingSection>
      </section>
    </main>
  );
}

function SettingSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="setting-section">
      <div className="setting-label">
        <span className="setting-icon" aria-hidden>
          {icon}
        </span>
        <div>
          <h2 className="setting-title">{title}</h2>
          <p className="setting-description text-secondary">{description}</p>
        </div>
      </div>
      <div className="setting-control">{children}</div>
    </section>
  );
}
