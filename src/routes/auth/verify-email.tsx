import { createFileRoute } from "@tanstack/react-router";

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`,
      );

      const data = await res.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: error || "Erreur de vérification",
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
