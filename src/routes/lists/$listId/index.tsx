import { createFileRoute } from "@tanstack/react-router";
import { listDataQuery } from "@/queries/list.queries";
import ListDetails from "@/components/layout/lists/list-details/list-details";
import ListSkeleton from "@/components/layout/lists/list-details/list-skeleton/list-skeleton";

export const Route = createFileRoute("/lists/$listId/")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(listDataQuery(params.listId));
  },
  pendingComponent: ListSkeleton,
  component: ListDetailsPage,
});

function ListDetailsPage() {
  return <ListDetails />;
}
