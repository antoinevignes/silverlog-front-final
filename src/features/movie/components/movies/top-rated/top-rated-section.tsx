import { useSuspenseQuery } from "@tanstack/react-query";
import { topRatedMoviesQuery } from "@/features/movie/api/movie.queries";
import type { MovieType } from "@/features/movie/types/movie";
import FilmPageSwiper from "@/components/ui/film-page-swiper/film-page-swiper";

type TopRatedMovie = MovieType & {
  weighted_avg: number;
  silverlog_avg: number | null;
  silverlog_count: number;
};

export default function TopRatedSection() {
  const { data } = useSuspenseQuery(topRatedMoviesQuery(1));

  const movies = (data?.results || []) as TopRatedMovie[];

  return <FilmPageSwiper movies={movies} id="top-rated" />;
}
