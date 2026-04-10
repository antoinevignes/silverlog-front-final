import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { listDataQuery } from "@/features/list/api/list.queries";
import ListDetails from "@/features/list/components/list-details/list-details";
import ListSkeleton from "@/features/list/components/list-details/list-skeleton/list-skeleton";
import { Suspense } from "react";
import { Seo } from "@/components/seo/seo";
import { generateItemListSchema } from "@/components/seo/schema-markup";

export const Route = createFileRoute("/lists/$listId/")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(listDataQuery(params.listId));
  },
  pendingComponent: ListSkeleton,
  component: ListDetailsPage,
});

function ListDetailsPage() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(listDataQuery(listId));

  const listMovies = list.movies?.map((m: any) => m.title) || [];

  return (
    <>
      <Seo
        title={list.title}
        description={list.description?.slice(0, 160)}
        type="article"
        schemaMarkup={generateItemListSchema(list.title, listMovies)}
      />
      <Suspense fallback={<ListSkeleton />}>
        <ListDetails />
      </Suspense>
    </>
  );
}
