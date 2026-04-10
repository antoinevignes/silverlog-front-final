import { useSuspenseQuery } from "@tanstack/react-query";
import { popularMoviesQuery } from "../../../api/movie.queries";
import FilmPageSwiper from "@/components/ui/film-page-swiper/film-page-swiper";

export default function PopularMovies() {
  const { data } = useSuspenseQuery(popularMoviesQuery());
  const movies = data?.results || [];

  return <FilmPageSwiper movies={movies} id="popular" />;
}
