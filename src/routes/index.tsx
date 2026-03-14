import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import VisitorHome from "@/components/layout/home/visitor-home";
import UserHome from "@/components/layout/home/user-home";
import { popularMoviesQuery, crewPicksQuery } from "@/queries/movie.queries";
import { recentReviewsQuery } from "@/queries/review.query";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(popularMoviesQuery());
    queryClient.prefetchQuery(recentReviewsQuery());
    queryClient.prefetchQuery(crewPicksQuery());
  },
  component: App,
});

function App() {
  const { user } = useAuth();

  return user ? <UserHome /> : <VisitorHome />;
}
