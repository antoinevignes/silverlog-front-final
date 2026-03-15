import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, Trash2, User, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
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
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog/dialog";

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

  // MAJ AVATAR
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatar();
  const { mutate: deleteAvatar, isPending: isDeletingAvatar } =
    useDeleteAvatar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) return;
    uploadAvatar(avatarFile);
  };

  // MAJ BACKDROP
  const backdropFileRef = useRef<HTMLInputElement>(null);
  const [backdropPreviewUrl, setBackdropPreviewUrl] = useState<string | null>(
    null,
  );
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const { mutate: uploadBackdrop, isPending: isUploadingBackdrop } =
    useUploadBanner();
  const { mutate: deleteBackdrop, isPending: isDeletingBackdrop } =
    useDeleteBanner();

  const handleBackdropFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackdropFile(file);
    setBackdropPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadBackdrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backdropFile) return;
    uploadBackdrop(backdropFile);
  };

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
          <form
            onSubmit={handleUploadAvatar}
            className="setting-form avatar-form"
          >
            <div className="avatar-upload-zone">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Aperçu avatar"
                  className="avatar-preview-img"
                  layout="constrained"
                  width={40}
                  height={40}
                  background="auto"
                  priority
                />
              ) : user?.avatar_path ? (
                <Image
                  src={getCloudinarySrc(user.avatar_path, "avatars")}
                  layout="constrained"
                  width={40}
                  height={40}
                  alt={`Avatar de ${user.username}`}
                  background="auto"
                  priority
                  className="avatar"
                />
              ) : (
                <span className="avatar-placeholder">
                  <User size={28} aria-hidden />
                </span>
              )}

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => avatarFileRef.current?.click()}
              >
                Choisir une image
              </Button>

              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                aria-label="Choisir une photo de profil"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isUploadingAvatar || !avatarFile}
            >
              {isUploadingAvatar ? "Upload..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              disabled={
                isUploadingAvatar ||
                isDeletingAvatar ||
                (!previewUrl && !avatarFile && !user?.avatar_path)
              }
              onClick={() => {
                if (previewUrl || avatarFile) {
                  setPreviewUrl(null);
                  setAvatarFile(null);
                  if (avatarFileRef.current) avatarFileRef.current.value = "";
                } else if (user?.avatar_path) {
                  deleteAvatar();
                }
              }}
              aria-label="Supprimer la photo de profil"
            >
              <Trash2 size={20} />
            </Button>
          </form>
        </SettingSection>

        {/* BACKDROP */}
        <SettingSection
          icon={<ImageIcon size={20} />}
          title="Bannière"
          description="Image de fond affichée sur votre page de profil."
        >
          <form
            onSubmit={handleUploadBackdrop}
            className="setting-form banner-form"
          >
            <div className="banner-upload-zone">
              {backdropPreviewUrl ? (
                <Image
                  src={backdropPreviewUrl}
                  alt="Aperçu bannière"
                  className="banner-preview-img"
                  layout="constrained"
                  width={160}
                  height={90}
                  background="auto"
                  priority
                />
              ) : user?.banner_path ? (
                <Image
                  src={getCloudinarySrc(user.banner_path, "banners")}
                  layout="constrained"
                  width={160}
                  height={90}
                  alt={`Bannière de ${user.username}`}
                  background="auto"
                  priority
                  className="banner-img"
                />
              ) : (
                <span className="banner-placeholder">
                  <ImageIcon size={28} aria-hidden />
                </span>
              )}

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => backdropFileRef.current?.click()}
              >
                Choisir une image
              </Button>

              <input
                ref={backdropFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleBackdropFileChange}
                aria-label="Choisir une bannière"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isUploadingBackdrop || !backdropFile}
            >
              {isUploadingBackdrop ? "Upload..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              disabled={
                isUploadingBackdrop ||
                isDeletingBackdrop ||
                (!backdropPreviewUrl && !backdropFile && !user?.banner_path)
              }
              onClick={() => {
                if (backdropPreviewUrl || backdropFile) {
                  setBackdropPreviewUrl(null);
                  setBackdropFile(null);
                  if (backdropFileRef.current)
                    backdropFileRef.current.value = "";
                } else if (user?.banner_path) {
                  deleteBackdrop();
                }
              }}
              aria-label="Supprimer la bannière"
            >
              <Trash2 size={20} />
            </Button>
          </form>
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
