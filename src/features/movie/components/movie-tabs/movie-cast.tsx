import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CircleUser } from "lucide-react";
import { Image } from "@unpic/react";
import type { CastType } from "@/features/movie/types/cast";
import { movieCreditsQuery } from "@/features/movie/api/movie.queries";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/components/ui/movie-swiper/movie-swiper.scss";
import Button from "@/components/ui/button/button";

export default function MovieCast() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const {
    data: { cast },
  }: { data: { cast: Array<CastType> } } = useSuspenseQuery(
    movieCreditsQuery(movieId),
  );

  return (
    <div className="movie-swiper-container cast-scroller">
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
        {cast.map((actor) => {
          const posterSrc = getCloudinarySrc(actor.profile_path, "persons");

          return (
            <SwiperSlide key={actor.id} className="actor-crew-card">
              <Link
                to="/person/$personId"
                params={{ personId: String(actor.id) }}
              >
                <figure className="actor-crew-image">
                  {!actor.profile_path ? (
                    <div className="actor-poster-fallback">
                      <CircleUser size={32} aria-hidden color="#262626" />
                    </div>
                  ) : (
                    <Image
                      src={posterSrc}
                      layout="fullWidth"
                      background="auto"
                      alt={`Image de ${actor.name}`}
                      className="person-image"
                    />
                  )}
                </figure>

                <p className="actor-crew-details link">
                  {actor.name} {actor.character && `(${actor.character})`}
                </p>
              </Link>
            </SwiperSlide>
          );
        })}
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
