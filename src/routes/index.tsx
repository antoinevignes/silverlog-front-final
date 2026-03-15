import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useAuth } from "@/auth";
import VisitorHome from "@/features/movie/components/visitor-home";
import UserHome from "@/features/user/components/user-home";
import { popularMoviesQuery, crewPicksQuery } from "@/features/movie/api/movie.queries";
import { recentReviewsQuery } from "@/features/review/api/review.query";
import VisitorHomeSkeleton from "@/features/movie/components/visitor-home-skeleton";
import UserHomeSkeleton from "@/features/user/components/user-home-skeleton";

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

  return (
    <Suspense fallback={user ? <UserHomeSkeleton /> : <VisitorHomeSkeleton />}>
      {user ? <UserHome /> : <VisitorHome />}
    </Suspense>
  );
}
