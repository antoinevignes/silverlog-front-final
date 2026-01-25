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
        `http://localhost:8000/user/verify-email?token=${token}`,
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

  console.log(data);

  return (
    <main>
      <h1>{data.message}</h1>
      <p>Test rendu de la page</p>
    </main>
  );
}
