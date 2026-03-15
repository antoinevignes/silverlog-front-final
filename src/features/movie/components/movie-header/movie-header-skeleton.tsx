import Skeleton from "@/components/ui/skeleton/skeleton";

export default function MovieHeaderSkeleton() {
  return (
    <>
      <Skeleton width="100%" height="100%" className="backdrop-fallback" />

      <article className="movie container">
        <header className="movie-header">
          <div className="poster-container-wrapper">
            <div className="poster-wrapper">
              <Skeleton className="poster-fallback" />
            </div>
          </div>

          <div className="movie-details">
            <Skeleton width="10rem" height={32} className="movie-title" />

            <div className="director-wrapper">
              <Skeleton width={100} height={16} />
            </div>

            <div className="movie-meta">
              <Skeleton width={50} height={16} />
            </div>

            <div className="grade grade-desktop">
              <Skeleton width={100} height={30} />
            </div>

            <Skeleton
              width="100%"
              height={200}
              className="synopsis synopsis-desktop"
            />

            <Skeleton width={100} height={16} className="genre-badges" />

            <Skeleton width={150} height={20} className="actions-desktop" />
          </div>
        </header>

        <Skeleton
          width="100%"
          height="8rem"
          className="synopsis synopsis-mobile"
        />

        <Skeleton width={100} height={16} className="genre-badges" />

        <Skeleton width={150} height={20} className="actions-mobile" />

        <section className="details-section">
          <Skeleton width="100%" height="10rem" className="tabs" />
        </section>
      </article>
    </>
  );
}
