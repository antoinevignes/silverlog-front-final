import { createFileRoute } from "@tanstack/react-router";
import SearchResults from "@/features/movie/components/search-results/search-results";
import { Suspense } from "react";
import Title from "@/components/ui/title/title";
import "./search.scss";

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
    <main className="container">
      <header className="search-header">
        <Title title={q ? `Résultats pour "${q}"` : "Recherche"} />
      </header>

      <Suspense fallback={<div>Chargement des résultats...</div>}>
        <SearchResults query={q || ""} />
      </Suspense>
    </main>
  );
}
