import { createFileRoute } from "@tanstack/react-router";
import { apiClient } from "@/utils/api-client";
import { Seo } from "@/components/seo/seo";

export const Route = createFileRoute("/auth/verify-email")({
  validateSearch: (search) =>
    search as {
      token: string;
    },
  loaderDeps: ({ search: { token } }) => ({ token }),
  loader: async ({ deps: { token } }) => {
    if (!token) {
      throw new Error("Lien de vérification invalide");
    }

    try {
      return await apiClient<{ success: boolean; message: string }>(
        "/auth/verify-email",
        {
          params: { token },
        },
      );
    } catch (error: unknown) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Erreur de vérification",
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <>
      <Seo
        title="Vérification email"
        description="Verifier son email pour valider son compte Silverlog"
        noIndex
      />
      <main>
        <h1>{data.message}</h1>
      </main>
    </>
  );
}
