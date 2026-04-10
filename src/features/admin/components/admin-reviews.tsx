import { useQuery } from "@tanstack/react-query";
import { adminReviewsQuery } from "@/features/admin/api/admin.queries";
import { useDeleteReview } from "@/features/admin/api/admin.mutations";
import Title from "@/components/ui/title/title";
import { Trash2 } from "lucide-react";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import Button from "@/components/ui/button/button";

export default function AdminReviews() {
  const { data: reviews, isLoading } = useQuery(adminReviewsQuery());
  const { mutate: deleteReview, isPending } = useDeleteReview();

  if (isLoading)
    return <p className="loading-message">Chargement des critiques...</p>;

  return (
    <div className="admin-reviews">
      <Title title="Modération des Critiques" variant="h2" />

      <div className="reviews-feed">
        {reviews?.map((r: any) => (
          <div key={r.id} className="review-mod-card">
            <div className="review-mod-poster">
              {r.movie_poster_path ? (
                <Image
                  src={getCloudinarySrc(r.movie_poster_path, "posters")}
                  width={50}
                  aspectRatio={2 / 3}
                  layout="constrained"
                  background="auto"
                  alt={`Affiche de ${r.movie_title}`}
                  className="review-poster-img"
                />
              ) : (
                <div className="review-poster-placeholder" />
              )}
            </div>

            <div className="review-mod-content">
              <div className="review-mod-header">
                <span className="review-movie-title">
                  {r.movie_title}
                </span>
                <span className="review-author">
                  par{" "}
                  <span className="review-author__name">
                    {r.username}
                  </span>
                </span>
                <span className="review-date">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </span>
                {r.rating && (
                  <span className="review-rating">{r.rating / 2} / 10</span>
                )}
              </div>
              <p className="review-body">{r.content}</p>
            </div>

            <div className="review-mod-actions">
              <Button
                variant="destructive"
                size="icon"
                disabled={isPending}
                onClick={() => {
                  if (confirm("Supprimer définitivement cette critique ?")) {
                    deleteReview(r.id);
                  }
                }}
                title="Supprimer la critique"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}

        {reviews?.length === 0 && (
          <p className="reviews-empty">
            Aucune critique à modérer.
          </p>
        )}
      </div>
    </div>
  );
}
