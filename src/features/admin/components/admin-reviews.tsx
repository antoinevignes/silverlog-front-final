import { useQuery } from "@tanstack/react-query";
import { adminReviewsQuery } from "@/features/admin/api/admin.queries";
import { useDeleteReview } from "@/features/admin/api/admin.mutations";
import Title from "@/components/ui/title/title";
import { Trash2 } from "lucide-react";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

export default function AdminReviews() {
  const { data: reviews, isLoading } = useQuery(adminReviewsQuery());
  const { mutate: deleteReview, isPending } = useDeleteReview();

  if (isLoading) return <p className="text-secondary py-lg">Chargement des critiques...</p>;

  return (
    <div className="admin-reviews-tab">
      <Title title="Modération des Critiques" variant="h2" className="mb-md" />

      <div className="reviews-feed">
        {reviews?.map((r: any) => (
          <div key={r.id} className="review-mod-card">
            <div className="review-mod-poster">
              {r.movie_poster_path ? (
                <Image
                  src={getCloudinarySrc(r.movie_poster_path, "posters")}
                  width={50}
                  aspectRatio={2/3}
                  layout="constrained"
                  background="auto"
                  alt={`Affiche de ${r.movie_title}`}
                  className="poster-img"
                />
              ) : (
                <div className="poster-placeholder" />
              )}
            </div>
            
            <div className="review-mod-content">
              <div className="review-mod-header">
                <span className="movie-title font-sentient">{r.movie_title}</span>
                <span className="author">par <span className="text-heading font-semibold">{r.username}</span></span>
                <span className="date text-secondary text-sm">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </span>
                {r.rating && (
                  <span className="rating text-brand font-semibold ml-auto">
                    {r.rating} / 10
                  </span>
                )}
              </div>
              <p className="review-body">{r.content}</p>
            </div>

            <div className="review-mod-actions">
              <button
                className="delete-icon-btn destructive"
                disabled={isPending}
                onClick={() => {
                  if(confirm("Supprimer définitivement cette critique ?")) {
                    deleteReview(r.id);
                  }
                }}
                title="Supprimer la critique"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {reviews?.length === 0 && (
          <p className="text-secondary text-center py-lg border-dashed">
            Aucune critique à modérer.
          </p>
        )}
      </div>
    </div>
  );
}
