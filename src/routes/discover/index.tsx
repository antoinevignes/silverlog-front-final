import { createFileRoute } from "@tanstack/react-router";
import {
  crewPicksQuery,
  popularMoviesQuery,
} from "@/features/movie/api/movie.queries";
import { popularReviewsQuery } from "@/features/review/api/review.query";
import { publicListsQuery } from "@/features/list/api/list.queries";
import { activeUsersQuery } from "@/features/user/api/user.queries";
import ActiveUsers from "@/features/user/components/discover/active-users";
import PopularReviews from "@/features/movie/components/movies/popular-reviews/popular-reviews";
import Title from "@/components/ui/title/title";
import "./discover-page.scss";
import CrewPicks from "@/features/movie/components/crew-picks/crew-picks";
import PopularMoviesLg from "@/features/movie/components/movies/popular-movies/popular-movies";
import { SuspenseSection } from "@/components/ui/suspense-section/suspense-section";
import CrewPicksSkeleton from "@/features/movie/components/crew-picks/crew-picks-skeleton";
import PopularMoviesLgSkeletons from "@/features/movie/components/movies/popular-movies/popular-movies-skeleton";
import PublicLists from "@/features/list/components/public-lists/public-lists";
import PopularReviewsSkeleton from "@/features/movie/components/movies/popular-reviews/popular-reviews-skeleton";
import PublicListsSkeleton from "@/features/list/components/public-lists/public-lists-skeleton";
import ActiveUsersSkeleton from "@/features/user/components/discover/active-users-skeleton";
import { Seo } from "@/components/seo/seo";

export const Route = createFileRoute("/discover/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(crewPicksQuery());
    queryClient.prefetchQuery(popularMoviesQuery());
    queryClient.prefetchQuery(popularReviewsQuery(10));
    queryClient.prefetchQuery(activeUsersQuery());
    queryClient.prefetchQuery(publicListsQuery());
  },
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <>
      <Seo
        title="Découvrir"
        description="Explorez les dernières tendances cinéma, découvrez les films populaires, les listes partagées et les avis de la communauté Silverlog."
        type="website"
      />
      <main className="discover-page">
        <header className="container discover-header">
          <Title title="Découvrir" variant="h1" size="lg" />
          <p className="discover-tagline text-secondary">
            Explorez les dernières tendances et découvrez de nouveaux films.
          </p>
        </header>

        <SuspenseSection
          title="La sélection de la rédaction"
          fallback={<CrewPicksSkeleton />}
          className="container"
        >
          <CrewPicks />
        </SuspenseSection>

        <SuspenseSection
          title="Populaire cette semaine"
          fallback={<PopularMoviesLgSkeletons />}
          className="container"
        >
          <PopularMoviesLg />
        </SuspenseSection>

        <SuspenseSection
          title="Listes publiques populaires"
          className="container"
          fallback={<PublicListsSkeleton />}
        >
          <PublicLists />
        </SuspenseSection>

        <div className="users-reviews-container container">
          <SuspenseSection
            title="Commentaires populaires"
            className="reviews-column"
            fallback={<PopularReviewsSkeleton />}
          >
            <PopularReviews limit={5} />
          </SuspenseSection>

          <SuspenseSection
            title="Utilisateurs actifs"
            className="users-sidebar"
            fallback={<ActiveUsersSkeleton />}
          >
            <ActiveUsers />
          </SuspenseSection>
        </div>
      </main>
    </>
  );
}
