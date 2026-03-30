import MovieSwiper from "@/components/ui/movie-swiper/movie-swiper";
import { popularMoviesQuery } from "@/features/movie/api/movie.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import "./popular-movies-lg.scss";

export default function PopularMoviesLg() {
  const { data: popularMovies } = useSuspenseQuery(popularMoviesQuery());

  return <MovieSwiper movies={popularMovies.results} />;
}
