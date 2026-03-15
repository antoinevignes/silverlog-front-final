import { createFileRoute } from "@tanstack/react-router";
import { listDataQuery } from "@/features/list/api/list.queries";
import ListDetails from "@/features/list/components/list-details/list-details";
import ListSkeleton from "@/features/list/components/list-details/list-skeleton/list-skeleton";
import { Suspense } from "react";

export const Route = createFileRoute("/lists/$listId/")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(listDataQuery(params.listId));
  },
  pendingComponent: ListSkeleton,
  component: ListDetailsPage,
});

function ListDetailsPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <ListDetails />
    </Suspense>
  );
}
