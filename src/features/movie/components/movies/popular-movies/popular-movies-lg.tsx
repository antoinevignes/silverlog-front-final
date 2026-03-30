import Button from "@/components/ui/button/button";
import MovieSwiper from "@/components/ui/movie-swiper/movie-swiper";
import Title from "@/components/ui/title/title";
import { popularMoviesQuery } from "@/features/movie/api/movie.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import "./popular-movies-lg.scss";

export default function PopularMoviesLg() {
  const { data: popularMovies } = useSuspenseQuery(popularMoviesQuery());

  return (
    <section className="container trending-section">
      <header className="section-header">
        <Title title="Populaire cette semaine" />

        <Button variant="ghost" size="sm" className="hidden-mobile">
          Voir plus
        </Button>
      </header>

      <MovieSwiper movies={popularMovies.results} />
    </section>
  );
}
