import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  personCreditsQuery,
  personDetailsQuery,
  personDetailsQueryUS,
} from "@/features/movie/api/person.queries";
import PersonDetails from "@/features/movie/components/person-details/person-details";
import PersonDetailsSkeleton from "@/features/movie/components/person-details/person-details-skeleton";
import { Seo } from "@/components/seo/seo";
import { generatePersonSchema } from "@/components/seo/schema-markup";

export const Route = createFileRoute("/person/$personId/")({
  loader: ({ context: { queryClient }, params: { personId } }) => {
    queryClient.prefetchQuery(personDetailsQuery(personId));
    queryClient.prefetchQuery(personDetailsQueryUS(personId));
    queryClient.prefetchQuery(personCreditsQuery(personId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { personId } = Route.useParams();
  const { data: person } = useSuspenseQuery(personDetailsQuery(personId));

  const personImage = person.profile_path
    ? `https://image.tmdb.org/t/p/original${person.profile_path}`
    : undefined;

  return (
    <>
      <Seo
        title={person.name}
        description={person.biography?.slice(0, 160)}
        image={personImage}
        type="person"
        schemaMarkup={generatePersonSchema(person)}
      />
      <Suspense fallback={<PersonDetailsSkeleton />}>
        <PersonDetails />
      </Suspense>
    </>
  );
}
