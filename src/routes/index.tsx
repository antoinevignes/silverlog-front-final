import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import VisitorHome from "@/features/movie/components/visitor-home";
import {
  popularMoviesQuery,
  crewPicksQuery,
} from "@/features/movie/api/movie.queries";
import { recentReviewsQuery } from "@/features/review/api/review.query";
import { userFeedQuery, userQuery } from "@/features/user/api/user.queries";
import MobileHomeHeader from "@/components/layout/mobile-home-header/mobile-home-header";
import UserHomeHeader from "@/features/user/components/user-home-header/user-home-header";
import { SuspenseSection } from "@/components/ui/suspense-section/suspense-section";
import PopularMoviesLg from "@/features/movie/components/movies/popular-movies/popular-movies";
import { Suspense } from "react";
import CrewPicks from "@/features/movie/components/crew-picks/crew-picks";
import FriendsFeed from "@/features/user/components/friends-feed/friends-feed";
import PopularMoviesLgSkeletons from "@/features/movie/components/movies/popular-movies/popular-movies-skeleton";
import CrewPicksSkeleton from "@/features/movie/components/crew-picks/crew-picks-skeleton";
import FriendsFeedSkeleton from "@/features/user/components/friends-feed/friends-feed-skeleton";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { Seo } from "@/components/seo/seo";
import { generateWebsiteSchema } from "@/components/seo/schema-markup";

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
    return (
      <>
        <Seo
          title="Accueil"
          description="Votre journal de films personnalisé. Notez, critiquez et partagez vos films préférés avec la communauté Silverlog."
          schemaMarkup={generateWebsiteSchema()}
        />
        <VisitorHome />
      </>
    );
  }

  return (
    <>
      <Seo
        title="Accueil"
        description="Votre journal de films personnalisé. Notez, critiquez et partagez vos films préférés avec la communauté Silverlog."
        schemaMarkup={generateWebsiteSchema()}
      />
      <MobileHomeHeader />

      <main className="user-home">
        <Suspense fallback={<Skeleton width="100%" height={126} />}>
          <UserHomeHeader />
        </Suspense>

        <SuspenseSection
          title="Populaire cette semaine"
          fallback={<PopularMoviesLgSkeletons />}
          className="container"
        >
          <PopularMoviesLg />
        </SuspenseSection>

        <SuspenseSection
          title="La sélection de la rédaction"
          fallback={<CrewPicksSkeleton />}
          className="container"
        >
          <CrewPicks />
        </SuspenseSection>

        <SuspenseSection
          title="Activité de vos abonnements"
          fallback={<FriendsFeedSkeleton />}
          className="container"
        >
          <FriendsFeed />
        </SuspenseSection>
      </main>
    </>
  );
}
