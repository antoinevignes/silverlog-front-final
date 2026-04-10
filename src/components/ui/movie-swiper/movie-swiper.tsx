import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "./movie-swiper.scss";

import type { MovieType } from "@/features/movie/types/movie";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import Button from "../button/button";

export default function MovieSwiper({ movies }: { movies: MovieType[] }) {
  return (
    <div className="movie-swiper-container">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".prev-btn",
          nextEl: ".next-btn",
        }}
        className="mySwiper"
        breakpoints={{
          0: {
            slidesPerView: 3.2,
            slidesPerGroup: 3,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 7.1,
            slidesPerGroup: 4,
            spaceBetween: 60,
            slidesOffsetAfter: 60,
          },
          1024: {
            slidesPerView: 8.4,
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

      <Button className="nav-btn prev-btn" variant="ghost" size="icon">
        <ChevronLeft size={32} />
      </Button>

      <Button className="nav-btn next-btn" variant="ghost" size="icon">
        <ChevronRight size={32} />
      </Button>
    </div>
  );
}
