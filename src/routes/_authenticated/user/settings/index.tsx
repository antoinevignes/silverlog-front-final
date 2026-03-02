import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, User } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/auth";
import {
  useUpdateLocation,
  useUpdateUsername,
  useUploadAvatar,
} from "@/queries/user.mutations";
import Title from "@/components/layout/title/title";
import "./settings.scss";
import { useAppForm } from "@/utils/useAppForm";
import z from "zod";
import Button from "@/components/ui/button/button";

export const Route = createFileRoute("/_authenticated/user/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const { mutate: updateUsername, isPending: isUpdatingUsername } =
    useUpdateUsername();
  const { mutate: updateLocation, isPending: isUpdatingLocation } =
    useUpdateLocation();

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

  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatar();

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
                <img
                  src={previewUrl}
                  alt="Aperçu avatar"
                  className="avatar-preview-img"
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
          </form>
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
