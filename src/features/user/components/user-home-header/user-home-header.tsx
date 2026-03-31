import { useAuth } from "@/auth";
import Badge from "@/components/ui/badge/badge";
import Title from "@/components/ui/title/title";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookmarkPlus, Clock } from "lucide-react";
import { userQuery } from "../../api/user.queries";
import "./user-home-header.scss";

export default function UserHomeHeader() {
  const { user } = useAuth();

  const { data: userData } = useSuspenseQuery(userQuery(user!.id));

  return (
    <header className="home-dashboard-header">
      <div className="container header-container">
        <div className="welcome-section">
          <Title
            title={`Bon retour, ${user?.username} !`}
            className="welcome-title font-sentient"
            size="lg"
            variant="h1"
          />
          <p className="welcome-subtitle text-secondary">
            Voici ce qu'il s'est passé depuis votre dernière visite.
          </p>
        </div>

        <div className="quick-stats-row">
          <Badge variant="outline" size="lg">
            <Clock size={16} className="stat-icon" />
            <span>
              <strong>{userData?.viewed_movies_this_month_count ?? 0}</strong>{" "}
              films vus ce mois
            </span>
          </Badge>

          <Badge variant="outline" size="lg">
            <BookmarkPlus size={16} className="stat-icon" />
            <span>
              <strong>{userData?.recent_watchlist_count ?? 0}</strong> envies
              récentes
            </span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
