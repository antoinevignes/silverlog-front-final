import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import VisitorHome from "@/features/movie/components/visitor-home";
import UserHome from "@/features/user/components/user-home";
import { popularMoviesQuery, crewPicksQuery } from "@/features/movie/api/movie.queries";
import { recentReviewsQuery } from "@/features/review/api/review.query";

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
