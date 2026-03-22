import { useQuery } from "@tanstack/react-query";
import { adminStatsQuery } from "@/features/admin/api/admin.queries";
import { Users, FileText, Film, List as ListIcon } from "lucide-react";
import Title from "@/components/ui/title/title";

export default function AdminStats() {
  const { data, isLoading, error } = useQuery(adminStatsQuery());

  if (isLoading) return <p className="text-secondary py-lg">Chargement des statistiques...</p>;
  if (error || !data) return <p className="text-destructive py-lg">Impossible de charger les statistiques.</p>;

  const statsList = [
    { label: "Membres inscrits", value: data.totalUsers, icon: Users },
    { label: "Critiques publiées", value: data.totalReviews, icon: FileText },
    { label: "Films notés", value: data.totalWatchedMovies, icon: Film },
    { label: "Listes personnalisées", value: data.totalCustomLists, icon: ListIcon },
  ];

  return (
    <div className="admin-stats-tab">
      <Title title="Vue d'ensemble" variant="h2" className="mb-md" />
      <div className="stats-grid">
        {statsList.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value font-sentient">{stat.value}</span>
                <span className="stat-label text-secondary">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
