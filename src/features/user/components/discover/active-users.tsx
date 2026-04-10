import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { activeUsersQuery } from "@/features/user/api/user.queries";
import { Avatar } from "@/components/ui/avatar/avatar";
import { FileText, Eye } from "lucide-react";
import "./active-users.scss";

export default function ActiveUsers() {
  const { data: users } = useSuspenseQuery(activeUsersQuery());

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="active-users-list">
      {users.map((user) => (
        <Link
          key={user.id}
          to="/user/$userId"
          params={{ userId: user.id }}
          className="active-user-card"
        >
          <Avatar
            username={user.username}
            src={user.avatar_path}
            size="md"
          />
          <div className="active-user-info">
            <span className="active-user-username">{user.username}</span>
            <div className="active-user-stats">
              <span className="stat">
                <FileText size={12} />
                {user.reviews_count} critiques
              </span>
              <span className="stat">
                <Eye size={12} />
                {user.watched_count} vus
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
