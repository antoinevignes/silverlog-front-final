import "./index.scss";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Edit,
  MapPin,
  Star,
  TextAlignStart,
  Film,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { userQuery } from "@/features/user/api/user.queries";
import Button from "@/components/ui/button/button";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import Title from "@/components/ui/title/title";
import Tabs from "@/components/ui/tabs/tabs";
import Watchlist from "@/features/user/components/profile-watchlist/profile-watchlist";
import Lists from "@/features/user/components/lists/lists";
import { useAuth } from "@/auth";
import { useReorderList } from "@/features/list/api/list.mutations";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import FollowModal from "@/features/user/components/follow-modal/follow-modal";
import {
  useFollowUser,
  useUnfollowUser,
} from "@/features/user/api/user.mutations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/components/ui/movie-swiper/movie-swiper.scss";
import { Avatar } from "@/components/ui/avatar/avatar";

export const Route = createFileRoute("/user/$userId/")({
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    await queryClient.prefetchQuery(userQuery(userId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = Route.useParams();
  const { data: userData } = useSuspenseQuery(userQuery(userId));

  const { mutate: followUser } = useFollowUser(userId);
  const { mutate: unfollowUser } = useUnfollowUser(userId);

  const [selected, setSelected] = useState<string>("a-propos");

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<
    "followers" | "following"
  >("followers");

  const openFollowModal = (type: "followers" | "following") => {
    setFollowModalType(type);
    setIsFollowModalOpen(true);
  };

  const { mutate: reorderList, isPending: isReordering } = useReorderList(
    String(user?.top_list_id),
  );

  const [isEditingTop, setIsEditingTop] = useState(false);
  const [topMovies, setTopMovies] = useState<any[]>(userData.top_movies ?? []);

  useEffect(() => {
    if (!isEditingTop) {
      setTopMovies(userData.top_movies ?? []);
    }
  }, [userData.top_movies, isEditingTop]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(topMovies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTopMovies(items);
  };

  const handleSaveTopOrder = () => {
    const movieIds = topMovies.map((m: any) => m.id);
    reorderList(movieIds, {
      onSuccess: () => {
        setIsEditingTop(false);
      },
    });
  };

  const tabs = [
    { id: "a-propos", label: "À propos" },
    {
      id: "watchlist",
      label: `Watchlist (${userData.watchlist_total})`,
    },
    { id: "lists", label: `Listes (${userData.custom_lists_total})` },
  ];

  return (
    <main className="user-profile">
      <figure className="profile-banner" aria-hidden="true">
        {userData.banner_path ? (
          <Image
            src={getCloudinarySrc(userData.banner_path, "banners")}
            layout="fullWidth"
            aspectRatio={21 / 9}
            className="banner-image"
            background="auto"
            alt={`Bannière de ${userData.username}`}
            priority
          />
        ) : (
          <div className="banner-placeholder">
            <Film size={48} aria-hidden />
          </div>
        )}
        <div className="banner-overlay"></div>
      </figure>

      <article className="container profile-layout">
        <header className="profile-header">
          <div className="avatar-stats-row">
            <figure className="avatar-container">
              <Avatar
                username={userData.username}
                src={userData.avatar_path}
                size="2xl"
              />
            </figure>

            <ul className="stats-container" role="list">
              <li className="stat-item">
                <strong className="stat-value">
                  {userData.viewed_movies_count}
                </strong>
                <span className="stat-label">Films</span>
              </li>

              <li className="stat-item">
                <strong className="stat-value">
                  {userData.viewed_movies_this_year_count}
                </strong>
                <span className="stat-label">Cette année</span>
              </li>

              <li className="stat-item">
                <strong className="stat-value">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="star-icon"
                    aria-hidden="true"
                  />
                  {userData.avg_rating}
                </strong>
                <span className="stat-label">Note Moy.</span>
              </li>
            </ul>
          </div>

          <section
            className="user-info-section"
            aria-label="Informations de l'utilisateur"
          >
            <div className="name-action-row">
              <h1 className="username">{userData.username}</h1>

              {Number(user?.id) === Number(userId) ? (
                <Link
                  to="/user/settings"
                  className="settings-link"
                  aria-label="Paramètres du profil"
                >
                  <Button size="icon" variant="ghost">
                    <Edit
                      size={16}
                      aria-label="Accéder au paramêtres du compte"
                    />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="follow-btn"
                  variant={userData.is_following ? "outline" : "default"}
                  onClick={() => {
                    if (!user) {
                      navigate({
                        to: "/auth/sign-in",
                        search: { redirect: window.location.pathname },
                      });
                      return;
                    }
                    userData.is_following ? unfollowUser() : followUser();
                  }}
                >
                  {userData.is_following ? "Ne plus suivre" : "Suivre"}
                </Button>
              )}
            </div>

            {userData.description && (
              <p className="user-bio">{userData.description}</p>
            )}

            <div className="user-social-stats">
              <span
                className="clickable-stat"
                role="button"
                tabIndex={0}
                onClick={() => openFollowModal("followers")}
              >
                <strong>{userData.followers_count || 0}</strong> Abonnés
              </span>

              <span
                className="clickable-stat"
                role="button"
                tabIndex={0}
                onClick={() => openFollowModal("following")}
              >
                <strong>{userData.following_count || 0}</strong> Abonnements
              </span>
            </div>

            <address className="user-meta">
              {userData.location && (
                <span className="meta-item">
                  <MapPin size={14} aria-hidden />
                  {userData.location}
                </span>
              )}
            </address>
          </section>

          {/* STATS AFFICHER ICI */}
        </header>

        <Tabs
          selected={selected}
          setSelected={setSelected}
          tabs={tabs}
          variant="transparent"
        />

        <section className="profile-content" aria-label="Contenu du profil">
          {selected === "a-propos" && (
            <>
              <section
                className="content-section"
                aria-labelledby="top-movies-title"
              >
                <div className="top-movies-header">
                  <div className="title-wrapper">
                    <Title title="Top 6" id="top-movies-title" />
                  </div>
                  {Number(user?.id) === Number(userId) && (
                    <div className="top-movies-actions">
                      {isEditingTop ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditingTop(false)}
                            disabled={isReordering}
                          >
                            Annuler
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveTopOrder}
                            disabled={isReordering}
                          >
                            Enregistrer
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingTop(true)}
                        >
                          Réorganiser
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="top-movies" direction="horizontal">
                    {(provided) => (
                      <ul
                        className="top-movies-grid"
                        role="list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {topMovies.map((movie: any, index: number) => (
                          <Draggable
                            key={String(movie.id)}
                            draggableId={String(movie.id)}
                            index={index}
                            isDragDisabled={!isEditingTop}
                          >
                            {(provided, snapshot) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`top-list-item ${snapshot.isDragging ? "is-dragging" : ""}`}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div className="draggable-card-wrapper">
                                  {!isEditingTop && (
                                    <div className="rank-badge font-sentient">
                                      {index + 1}
                                    </div>
                                  )}
                                  {isEditingTop && (
                                    <div
                                      {...provided.dragHandleProps}
                                      className="drag-handle"
                                    >
                                      <GripVertical size={16} color="white" />
                                    </div>
                                  )}
                                  <div
                                    className={`card-mobile ${isEditingTop ? "editing-mode" : ""}`}
                                  >
                                    <MovieCard movie={movie} size="sm" />
                                  </div>
                                  <div
                                    className={`card-desktop ${isEditingTop ? "editing-mode" : ""}`}
                                  >
                                    <MovieCard movie={movie} size="md" />
                                  </div>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </section>

              <section
                className="content-section movie-swiper-container"
                aria-labelledby="recent-activity-title"
              >
                <Title title="Activité récente" id="recent-activity-title" />

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
                  {(userData.recent_activity ?? []).map((movie: any) => (
                    <SwiperSlide key={movie.id} className="activity-item">
                      <MovieCard movie={movie} size="sm" />

                      <div className="activity-meta">
                        <div
                          className="rating-stars"
                          aria-label={`Note : ${movie.rating / 2} sur 5`}
                        >
                          {Array.from({ length: movie.rating / 2 }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                size={10}
                                fill="#F2C265"
                                stroke="#F2C265"
                                aria-hidden
                              />
                            ),
                          )}
                        </div>

                        {movie.review_content && (
                          <span
                            className="review-icon"
                            aria-label="Critique rédigée"
                          >
                            <TextAlignStart size={10} aria-hidden />
                          </span>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Button
                  className="nav-btn prev-btn"
                  variant="ghost"
                  size="icon"
                >
                  <ChevronLeft size={32} />
                </Button>

                <Button
                  className="nav-btn next-btn"
                  variant="ghost"
                  size="icon"
                >
                  <ChevronRight size={32} />
                </Button>
              </section>
            </>
          )}

          {selected === "watchlist" && (
            <Suspense
              fallback={
                <ul className="watchlist-grid">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <li key={index}>
                      <Skeleton className="poster-skeleton" />
                    </li>
                  ))}
                </ul>
              }
            >
              <Watchlist />
            </Suspense>
          )}

          {selected === "lists" && (
            <Suspense
              fallback={
                <div className="lists-skeleton-grid">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="list-card-skeleton">
                      <div className="skeleton-info">
                        <Skeleton height={20} width="80%" />
                        <Skeleton height={24} width="30%" />
                        <Skeleton height={14} width="90%" />
                        <Skeleton height={14} width="60%" />
                        <Skeleton height={14} width="40%" />
                      </div>
                      <div className="skeleton-posters">
                        <Skeleton className="poster depth-2" />
                        <Skeleton className="poster depth-1" />
                        <Skeleton className="poster depth-0" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <Lists />
            </Suspense>
          )}
        </section>
      </article>

      {isFollowModalOpen && (
        <FollowModal
          isOpen={isFollowModalOpen}
          onClose={setIsFollowModalOpen}
          userId={userId}
          type={followModalType}
          title={followModalType === "followers" ? "Abonnés" : "Abonnements"}
        />
      )}
    </main>
  );
}
