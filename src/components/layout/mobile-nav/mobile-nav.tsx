import { Link } from "@tanstack/react-router";
import { Bookmark, Home, ListVideo, User } from "lucide-react";
import "./mobile-nav.scss";
import { useAuth } from "@/auth";

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
          <Link to="/lists" className="nav-link">
            <ListVideo size={24} />
            <span>Listes</span>
          </Link>
        </li>
        <li>
          <Link to="/user/activity" className="nav-link">
            <Bookmark size={24} />
            <span>Watchlist</span>
          </Link>
        </li>

        {user ? (
          <li>
            <Link
              to="/user/$userId"
              params={{ userId: user?.id?.toString() || "" }}
              className="nav-link"
              aria-label="Profil"
            >
              <User size={24} />
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
