import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  personCreditsQuery,
  personDetailsQuery,
  personDetailsQueryUS,
} from "@/features/movie/api/person.queries";
import PersonDetails from "@/features/movie/components/person-details/person-details";
import PersonDetailsSkeleton from "@/features/movie/components/person-details/person-details-skeleton";

export const Route = createFileRoute("/person/$personId/")({
  loader: ({ context: { queryClient }, params: { personId } }) => {
    queryClient.prefetchQuery(personDetailsQuery(personId));
    queryClient.prefetchQuery(personDetailsQueryUS(personId));
    queryClient.prefetchQuery(personCreditsQuery(personId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<PersonDetailsSkeleton />}>
      <PersonDetails />
    </Suspense>
  );
}
