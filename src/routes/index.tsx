import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useAuth } from "@/auth";
import VisitorHome from "@/features/movie/components/visitor-home";
import UserHome from "@/features/user/components/user-home";
import {
  popularMoviesQuery,
  crewPicksQuery,
} from "@/features/movie/api/movie.queries";
import { recentReviewsQuery } from "@/features/review/api/review.query";
import { userQuery } from "@/features/user/api/user.queries";
import VisitorHomeSkeleton from "@/features/movie/components/visitor-home-skeleton";
import UserHomeSkeleton from "@/features/user/components/user-home-skeleton";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient, auth } }) => {
    queryClient.prefetchQuery(popularMoviesQuery());
    queryClient.prefetchQuery(recentReviewsQuery());
    queryClient.prefetchQuery(crewPicksQuery());
    if (auth.isAuthenticated && auth.user?.id) {
      await queryClient.prefetchQuery(userQuery(String(auth.user.id)));
    }
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
