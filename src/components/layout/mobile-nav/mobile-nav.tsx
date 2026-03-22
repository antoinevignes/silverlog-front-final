import { Link } from "@tanstack/react-router";
import { Bookmark, Home, ListVideo, User, Shield } from "lucide-react";
import "./mobile-nav.scss";
import { useAuth } from "@/auth";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

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

        {user?.role === "admin" && (
          <li>
            <Link to="/admin" className="nav-link">
              <Shield size={24} />
              <span>Admin</span>
            </Link>
          </li>
        )}

        {user ? (
          <li>
            <Link
              to="/user/$userId"
              params={{ userId: user?.id?.toString() || "" }}
              className="nav-link avatar-link"
              aria-label="Profil"
            >
              <div className="avatar-icon-wrapper">
                {user.avatar_path ? (
                  <Image
                    src={getCloudinarySrc(user.avatar_path, "avatars")}
                    layout="fullWidth"
                    aspectRatio={1 / 1}
                    alt={`Avatar de ${user.username}`}
                    background="auto"
                    priority
                    className="avatar"
                  />
                ) : (
                  <div
                    className="font-sentient"
                    aria-label={`Initiale de ${user.username}`}
                  >
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
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
