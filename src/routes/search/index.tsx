import { createFileRoute } from "@tanstack/react-router";
import SearchResults from "@/features/movie/components/search-results/search-results";
import { Suspense } from "react";
import Title from "@/components/ui/title/title";
import "./search.scss";
import { Seo } from "@/components/seo/seo";

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute("/search/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();

  return (
    <>
      <Seo
        title={q ? `Recherche : ${q}` : "Recherche"}
        description={
          q
            ? `Résultats de recherche pour "${q}" sur Silverlog.`
            : "Recherchez des films, des acteurs et des cinéphiles sur Silverlog."
        }
        type="website"
      />
      <main className="container">
        <header className="search-header">
          <Title
            title={q ? `Résultats pour "${q}"` : "Recherche"}
            size="lg"
            variant="h1"
          />
        </header>

        <Suspense fallback={<div>Chargement des résultats...</div>}>
          <SearchResults query={q || ""} />
        </Suspense>
      </main>
    </>
  );
}
