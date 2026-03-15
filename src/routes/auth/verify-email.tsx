import { createFileRoute } from "@tanstack/react-router";
import { apiClient } from "@/utils/api-client";

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
      return await apiClient<any>("/auth/verify-email", {
        params: { token },
      });
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Erreur de vérification",
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <main>
      <h1>{data.message}</h1>
    </main>
  );
}
