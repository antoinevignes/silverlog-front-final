import { createFileRoute } from "@tanstack/react-router";
import "./index.scss";
import { publicListsQuery } from "@/queries/list.queries";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ListCard from "@/components/layout/list-card/list-card";
import Skeleton from "@/components/ui/skeleton/skeleton";

export const Route = createFileRoute("/_authenticated/lists/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(publicListsQuery());
  },
  component: PublicListsPage,
});

function PublicListsPage() {
  return (
    <div className="public-lists-page container">
      <header className="page-header">
        <h1 className="font-sentient">Listes Publiques</h1>
        <p className="text-secondary text-lg">
          Découvrez les sélections de la communauté.
        </p>
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
      {lists.map((list: any) => (
        <ListCard key={list.id} list={list} />
      ))}
    </section>
  );
}
