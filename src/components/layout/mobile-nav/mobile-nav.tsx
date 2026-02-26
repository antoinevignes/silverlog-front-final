import { Link } from "@tanstack/react-router";
import { Home, ListVideo, Bookmark, User } from "lucide-react";
import "./mobile-nav.scss";

export default function MobileNav() {
  return (
    <nav className="mobile-bottom-nav">
      <ul className="nav-items">
        <li>
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "active" }}
            activeOptions={{ exact: true }}
          >
            <Home size={24} />
            <span>Accueil</span>
          </Link>
        </li>
        <li>
          <Link
            to="/lists"
            className="nav-link"
            activeProps={{ className: "active" }}
          >
            <ListVideo size={24} />
            <span>Listes</span>
          </Link>
        </li>
        <li>
          <Link
            to="/user/activity"
            className="nav-link"
            activeProps={{ className: "active" }}
          >
            <Bookmark size={24} />
            <span>Watchlist</span>
          </Link>
        </li>
        <li>
          {/* Defaulting to home since profile page doesn't exist yet */}
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "active" }}
            aria-label="Profil"
          >
            <User size={24} />
            <span>Profil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
