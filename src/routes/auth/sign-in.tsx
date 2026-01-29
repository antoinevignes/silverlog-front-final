import "./auth.scss";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FieldInfo, useAppForm } from "@/utils/useAppForm";
import z from "zod";

export const Route = createFileRoute("/auth/sign-in")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.email("Email requis"),
        password: z.string().trim().min(1, "Mot de passe requis"),
      }),
    },
    onSubmit: async ({ value }) => {
      await auth.login(value.email, value.password);
      navigate({ to: redirect, search: (prev) => prev });
    },
  });

  return (
    <main className="auth-page">
      <img src="/logo.svg" alt="Logo de silverlog" />
      <h1>Silverlog</h1>

      <p className="text-secondary description">
        Suivez les films que vous avez vus.
        <br /> Sauvegardez ceux que vous voulez voir.
        <br /> Partagez vos coups de coeur avec vos amis.
      </p>

      <h2>Connexion</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
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
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <form.Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </form.Button>
            )}
          />
        </form.AppForm>
      </form>

      <p id="auth-change">
        <span className="text-secondary">Nouveau sur Silverlog ?</span>
        <Link className="link" to="/auth/sign-up">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
