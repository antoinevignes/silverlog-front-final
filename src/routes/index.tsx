import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import VisitorHome from "@/features/movie/components/visitor-home";
import UserHome from "@/features/user/components/user-home";
import {
  popularMoviesQuery,
  crewPicksQuery,
} from "@/features/movie/api/movie.queries";
import { recentReviewsQuery } from "@/features/review/api/review.query";
import { userFeedQuery, userQuery } from "@/features/user/api/user.queries";
import MobileHomeHeader from "@/components/layout/mobile-home-header/mobile-home-header";
import UserHomeHeader from "@/features/user/components/user-home-header/user-home-header";
import { SuspenseSection } from "@/components/ui/suspense-section/suspense-section";
import PopularMoviesLg from "@/features/movie/components/movies/popular-movies/popular-movies-lg";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient, auth } }) => {
    queryClient.prefetchQuery(popularMoviesQuery());
    queryClient.prefetchQuery(crewPicksQuery());
    queryClient.prefetchQuery(recentReviewsQuery());

    if (auth.isAuthenticated && auth.user?.id) {
      queryClient.prefetchQuery(userQuery(String(auth.user.id)));
      queryClient.prefetchQuery(userFeedQuery());
    }
  },
  component: App,
});

function App() {
  const { user } = useAuth();

  if (!user) {
    return <VisitorHome />;
  }

  return (
    <>
      <MobileHomeHeader />

      <main className="user-home">
        <Suspense fallback={<div>CHARGEMENT</div>}>
          <UserHomeHeader />
        </Suspense>

        <SuspenseSection
          title="Populaire cette semaine"
          fallback={<>CHARGEMENT</>}
        >
          <PopularMoviesLg />
        </SuspenseSection>

        <UserHome />
      </main>
    </>
  );
}
