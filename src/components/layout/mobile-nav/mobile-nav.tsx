import { Link } from "@tanstack/react-router";
import { Bookmark, Home, User, Film, Compass } from "lucide-react";
import "./mobile-nav.scss";
import { useAuth } from "@/auth";
import { Avatar } from "@/components/ui/avatar/avatar";

export default function MobileNav() {
  const { user } = useAuth();

  return (
    <nav className="mobile-bottom-nav">
      <ul className="nav-items">
        <li>
          <Link to="/" className="nav-link">
            <Home size={24} />
            <span>Accueil</span>
          </Link>
        </li>
        <li>
          <Link to="/movies" className="nav-link">
            <Film size={24} />
            <span>Films</span>
          </Link>
        </li>
        <li>
          <Link to="/discover" className="nav-link">
            <Compass size={24} />
            <span>Découvrir</span>
          </Link>
        </li>
        <li>
          <Link to="/user/activity" className="nav-link">
            <Bookmark size={24} />
            <span>Activité</span>
          </Link>
        </li>

        {user ? (
          <li>
            <Link
              to="/user/$userId"
              params={{ userId: user?.id?.toString() || "" }}
              className="nav-link avatar-link"
              aria-label="Profil"
            >
              <div className="avatar-icon-wrapper">
                <Avatar
                  username={user.username}
                  src={user.avatar_path}
                  size="xs"
                />
              </div>
              <span>Profil</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link
              to="/auth/sign-in"
              search={{
                redirect: location.pathname,
              }}
              className="nav-link"
              aria-label="Connexion"
            >
              <User size={24} />
              <span>Connexion</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
