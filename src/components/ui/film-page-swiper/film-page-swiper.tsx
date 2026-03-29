import MovieCard from "@/features/movie/components/movie-card/movie-card";
import type { MovieType } from "@/features/movie/types/movie";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../button/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./film-page-swiper.scss";

type FilmPageSwiperProps = {
  movies: MovieType[];
  id?: string;
};

export default function FilmPageSwiper({ movies, id = "default" }: FilmPageSwiperProps) {
  const prevClass = `film-page-swiper-prev-btn-${id}`;
  const nextClass = `film-page-swiper-next-btn-${id}`;

  return (
    <div className="film-page-swiper-container">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        className="film-page-swiper"
        breakpoints={{
          0: {
            slidesPerView: 3.2,
            slidesPerGroup: 3,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4.1,
            slidesPerGroup: 3,
            spaceBetween: 60,
            slidesOffsetAfter: 60,
          },
          1024: {
            slidesPerView: 6.2,
            slidesPerGroup: 4,
            spaceBetween: 20,
            slidesOffsetAfter: 10,
          },
        }}
      >
        {movies.map((movie: MovieType) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} size="sm" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Button
        className={`nav-btn ${prevClass}`}
        variant="ghost"
        size="icon"
      >
        <ChevronLeft size={32} />
      </Button>

      <Button
        className={`nav-btn ${nextClass}`}
        variant="ghost"
        size="icon"
      >
        <ChevronRight size={32} />
      </Button>
    </div>
  );
}
