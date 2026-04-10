import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  MapPin,
  Trash2,
  User,
  Image as ImageIcon,
  Lock,
  LogOut,
  FileText,
} from "lucide-react";
import { useAuth } from "@/auth";
import { useState, useEffect } from "react";
import { useToggle } from "@/utils/use-toggle";
import {
  useUpdateLocation,
  useUpdateDescription,
  useUpdateUsername,
  useUploadAvatar,
  useDeleteAccount,
  useDeleteAvatar,
  useUploadBanner,
  useDeleteBanner,
  useUpdatePassword,
} from "@/features/user/api/user.mutations";
import { FieldInfo } from "@/utils/useAppForm";
import { Label } from "@/components/ui/label/label";
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
import { Seo } from "@/components/seo/seo";

export const Route = createFileRoute("/_authenticated/user/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logout } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } =
    useToggle();

  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();
  const { mutate: updateUsername, isPending: isUpdatingUsername } =
    useUpdateUsername();
  const { mutate: updateLocation, isPending: isUpdatingLocation } =
    useUpdateLocation();
  const { mutate: updateDescription, isPending: isUpdatingDescription } =
    useUpdateDescription();

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

  // MAJ DESCRIPTION
  const descriptionForm = useAppForm({
    defaultValues: {
      description: user?.description ?? "",
    },
    validators: {
      onChange: z.object({
        description: z.string().trim().max(140, "Maximum 140 caractères"),
      }),
    },
    onSubmit: ({ value }) => {
      updateDescription(value.description);
    },
  });

  // MAJ MOT DE PASSE
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  const passwordForm = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z
        .object({
          currentPassword: z
            .string()
            .trim()
            .min(12, "Mot de passe trop court")
            .max(128, "Mot de passe trop long")
            .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
            .regex(/[a-z]/, "Doit contenir au moins une minuscule")
            .regex(/\d/, "Doit contenir au moins un chiffre")
            .regex(
              new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?~`]"),
              "Doit contenir un caractère spécial",
            )
            .refine((val) => !/\s/.test(val), "Ne doit pas contenir d'espace"),
          newPassword: z
            .string()
            .trim()
            .min(12, "Mot de passe trop court")
            .max(128, "Mot de passe trop long")
            .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
            .regex(/[a-z]/, "Doit contenir au moins une minuscule")
            .regex(/\d/, "Doit contenir au moins un chiffre")
            .regex(
              new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?~`]"),
              "Doit contenir un caractère spécial",
            )
            .refine((val) => !/\s/.test(val), "Ne doit pas contenir d'espace"),
          confirmPassword: z.string().trim(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Les mots de passe ne correspondent pas",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: ({ value }) => {
      updatePassword(value);
      passwordForm.reset();
    },
  });

  return (
    <>
      <Seo
        title="Paramètres"
        description="Paramêtres de l'utilisateur sur le site Silverlog"
        noIndex
      />
      <main className="settings-page container">
        <header className="settings-header pb-lg">
          <Title title="Paramètres" variant="h1" size="lg" />
          <p className="text-secondary mt-xs">
            Gérez votre profil et vos préférences.
          </p>
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
              className="setting-form gap-sm"
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
              className="setting-form gap-sm"
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

          {/* DESCRIPTION */}
          <SettingSection
            icon={<FileText size={20} />}
            title="Description"
            description="Décrivez-vous en quelques mots. Maximum 140 caractères."
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                descriptionForm.handleSubmit();
              }}
              className="setting-form description-form gap-sm"
            >
              <descriptionForm.AppField
                name="description"
                children={(field) => (
                  <div className="description-wrapper">
                    <field.Textarea
                      id="description"
                      placeholder="Votre description..."
                      rows={3}
                    />
                    <span
                      className={`char-count mt-xs ${field.state.value.length > 140 ? "error" : ""}`}
                    >
                      {field.state.value.length}/140
                    </span>
                  </div>
                )}
              />

              <descriptionForm.AppForm>
                <descriptionForm.Subscribe
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.isPristine,
                  ]}
                  children={([canSubmit, isSubmitting, isPristine]) => (
                    <descriptionForm.Button
                      type="submit"
                      size="sm"
                      disabled={
                        !canSubmit ||
                        isSubmitting ||
                        isUpdatingDescription ||
                        isPristine
                      }
                    >
                      {isUpdatingDescription
                        ? "Mise à jour..."
                        : "Mettre à jour"}
                    </descriptionForm.Button>
                  )}
                />
              </descriptionForm.AppForm>
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
              formClassName="setting-form avatar-form gap-sm"
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
              formClassName="setting-form banner-form gap-sm"
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

          {/* MOT DE PASSE */}
          <SettingSection
            icon={<Lock size={20} />}
            title="Mot de passe"
            description="Modifiez votre mot de passe."
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                passwordForm.handleSubmit();
              }}
              className="setting-form password-form gap-sm"
            >
              <div className="password-fields gap-md">
                <div className="password-field gap-xs">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <passwordForm.AppField
                    name="currentPassword"
                    children={(field) => (
                      <>
                        <field.Input
                          id="currentPassword"
                          type="password"
                          placeholder="********"
                          leftIcon={<Lock />}
                        />
                        <FieldInfo field={field} />
                      </>
                    )}
                  />
                </div>

                <div className="password-field gap-xs">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <passwordForm.AppField
                    name="newPassword"
                    children={(field) => (
                      <>
                        <field.Input
                          id="newPassword"
                          type="password"
                          placeholder="********"
                          leftIcon={<Lock />}
                        />
                        <FieldInfo field={field} />
                      </>
                    )}
                  />
                </div>

                <div className="password-field gap-xs">
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <passwordForm.AppField
                    name="confirmPassword"
                    children={(field) => (
                      <>
                        <field.Input
                          id="confirmPassword"
                          type="password"
                          placeholder="********"
                          leftIcon={<Lock />}
                        />
                        <FieldInfo field={field} />
                      </>
                    )}
                  />
                </div>
              </div>

              <passwordForm.AppForm>
                <passwordForm.Subscribe
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.isPristine,
                  ]}
                  children={([canSubmit, isSubmitting, isPristine]) => (
                    <passwordForm.Button
                      type="submit"
                      size="sm"
                      disabled={
                        !canSubmit ||
                        isSubmitting ||
                        isUpdatingPassword ||
                        isPristine
                      }
                    >
                      {isUpdatingPassword ? "Mise à jour..." : "Mettre à jour"}
                    </passwordForm.Button>
                  )}
                />
              </passwordForm.AppForm>
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
                <h2 className="delete-dialog-title">Supprimer votre compte</h2>
                <p className="text-secondary delete-dialog-desc">
                  Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                  est irréversible et toutes vos données seront perdues.
                </p>
                <DialogFooter>
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
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SettingSection>

          {/* DÉCONNEXION - MOBILE ONLY */}
          {!isDesktop && (
            <SettingSection
              icon={<LogOut size={20} />}
              title="Déconnexion"
              description="Se déconnecter de votre compte Silverlog."
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="logout-btn"
              >
                Se déconnecter
              </Button>
            </SettingSection>
          )}
        </section>
      </main>
    </>
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
    <section className="setting-section gap-lg py-xl">
      <div className="setting-label gap-md">
        <span className="setting-icon" aria-hidden>
          {icon}
        </span>
        <div>
          <h2 className="setting-title mb-xs">{title}</h2>
          <p className="setting-description text-secondary">{description}</p>
        </div>
      </div>
      <div className="setting-control gap-md">{children}</div>
    </section>
  );
}
