import "./auth.scss";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { FieldInfo, useAppForm } from "@/utils/useAppForm";
import { Label } from "@/components/ui/label/label";
import { Separator } from "@/components/ui/separator/separator";
import { Image } from "@unpic/react";
import { apiClient } from "@/utils/api-client";
import { Seo } from "@/components/seo/seo";

export const Route = createFileRoute("/auth/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: (values: {
      username: string;
      email: string;
      password: string;
    }) =>
      apiClient<any>("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: (data) => {
      if (data.success) toast.success(data.success);
      navigate({ to: "/auth/sign-in", search: { redirect: "/" } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useAppForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        username: z.string().trim().min(1, "Nom d'utilisateur requis"),
        email: z.email("Email requis"),
        password: z
          .string()
          .trim()
          .min(12, "Mot de passe trop court (12 caractères minimum)")
          .max(128, "Mot de passe trop long (128 caractères maximum)")
          .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
          .regex(/[a-z]/, "Doit contenir au moins une minuscule")
          .regex(/\d/, "Doit contenir au moins un chiffre")
          .regex(
            new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?~`]"),
            "Doit contenir un caractère spécial (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~`)",
          )
          .refine((val) => !/\s/.test(val), "Ne doit pas contenir d'espace"),
      }),
    },
    onSubmit: ({ value }) => {
      signUpMutation.mutate(value);
    },
  });

  return (
    <>
      <Seo
        title="Créer un compte"
        description="Créer un compte sur Silverlog"
        noIndex
      />
      <main className="auth-page">
        <Image
          layout="constrained"
          width={80}
          height={80}
          src="/logo.svg"
          alt="Logo de silverlog"
        />
        <h1>Silverlog</h1>

        <p className="text-secondary description">
          Suivez les films que vous avez vus.
          <br /> Sauvegardez ceux que vous voulez voir.
          <br /> Partagez vos coups de coeur avec vos amis.
        </p>

        <Separator />

        <h2>Créer un compte</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div>
            <Label htmlFor="username">Nom d'utilisateur*</Label>
            <form.AppField
              name="username"
              children={(field) => (
                <>
                  <field.Input
                    id="username"
                    placeholder="Votre nom d'utilisateur"
                    leftIcon={<User />}
                  />

                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="email">Email*</Label>
            <form.AppField
              name="email"
              children={(field) => (
                <>
                  <field.Input
                    id="email"
                    placeholder="exemple@email.com"
                    leftIcon={<Mail />}
                  />

                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe*</Label>
            <form.AppField
              name="password"
              children={(field) => (
                <>
                  <field.Input
                    id="password"
                    type="password"
                    placeholder="*********"
                    leftIcon={<Lock />}
                  />

                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>

          <form.AppForm>
            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <form.Button
                  type="submit"
                  disabled={!canSubmit || signUpMutation.isPending}
                >
                  {signUpMutation.isPending
                    ? "Création du compte..."
                    : "S'inscrire"}
                </form.Button>
              )}
            />
          </form.AppForm>
        </form>

        <p id="auth-change">
          <span className="text-secondary">Vous avez déjà un compte ? </span>
          <Link className="link" to="/auth/sign-in" search={{ redirect: "/" }}>
            Connectez vous
          </Link>
        </p>

        <p className="text-secondary">
          Pour en savoir plus sur notre politique de confidentialité,{" "}
          <Link to="/about" className="underline-link">
            cliquez ici
          </Link>
          .
        </p>
      </main>
    </>
  );
}
