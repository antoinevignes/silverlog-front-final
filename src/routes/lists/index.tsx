import { createFileRoute } from "@tanstack/react-router";
import "./index.scss";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ListType } from "@/utils/types/list";
import { publicListsQuery } from "@/queries/list.queries";
import ListCard from "@/components/layout/lists/list-card/list-card";
import Skeleton from "@/components/ui/skeleton/skeleton";
import Title from "@/components/layout/title/title";

export const Route = createFileRoute("/lists/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(publicListsQuery());
  },
  component: PublicListsPage,
});

function PublicListsPage() {
  return (
    <div className="public-lists-page container">
      <header className="page-header">
        <Title
          title="Listes Publiques"
          size="lg"
          variant="h1"
          subtitle="Découvrez les sélections de la communauté."
        />
      </header>

      <Suspense
        fallback={
          <div className="list-skeleton">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} width="100%" height="10rem" />
            ))}
          </div>
        }
      >
        <Lists />
      </Suspense>
    </div>
  );
}

export default function Lists() {
  const { data: lists } = useSuspenseQuery(publicListsQuery());

  return (
    <section className="lists-grid">
      {lists.map((list: ListType) => (
        <ListCard key={list.id} list={list} />
      ))}
    </section>
  );
}
