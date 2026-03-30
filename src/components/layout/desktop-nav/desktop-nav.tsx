import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, LogOut, Search, Settings, Shield, X } from "lucide-react";
import "./desktop-nav.scss";
import { useState } from "react";
import { useAuth } from "@/auth";
import SearchBar from "@/features/movie/components/search-bar/search-bar";
import NotificationBell from "@/features/notification/components/notification-bell";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import Button from "@/components/ui/button/button";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

export default function DesktopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="desktop-top-nav">
      <div className="nav-container container">
        <Link to="/" className="brand">
          <Image
            src="/logo.svg"
            alt="Logo de Silverlog"
            className="logo"
            layout="constrained"
            width={40}
            height={40}
            background="auto"
            priority
          />
          <span className="brand-name font-sentient">Silverlog</span>
        </Link>

        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/lists">Découvrir</Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/user/activity">Watchlist</Link>
                </li>
                <li>
                  <Link to="/user/activity">Journal</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <section className="right-section">
          <div className={`search-container ${isSearchOpen ? "open" : ""}`}>
            <div className="search-wrapper">
              <SearchBar />
            </div>

            {isSearchOpen ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={20} />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </Button>
            )}

            {user && <NotificationBell />}
          </div>

          <div className="user-actions">
            {user ? (
              <DropdownMenu>
                <DropdownTrigger>
                  <div className="avatar-trigger">
                    {user.avatar_path ? (
                      <Image
                        src={getCloudinarySrc(user.avatar_path, "avatars")}
                        layout="constrained"
                        width={40}
                        height={40}
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
                </DropdownTrigger>

                <DropdownContent align="right">
                  <div className="dropdown-header">
                    <span className="username">{user.username}</span>
                    <span className="email">{user.email}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <DropdownItem
                    onClick={() =>
                      navigate({
                        to: "/user/$userId",
                        params: { userId: user?.id?.toString() || "" },
                      })
                    }
                  >
                    <BookOpen size={16} />
                    Mon Profil
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => navigate({ to: "/user/settings" })}
                  >
                    <Settings size={16} />
                    Paramètres
                  </DropdownItem>
                  <hr className="dropdown-divider" />
                  {user.role === "admin" && (
                    <DropdownItem onClick={() => navigate({ to: "/admin" })}>
                      <Shield size={16} />
                      Administration
                    </DropdownItem>
                  )}
                  <DropdownItem onClick={logout}>
                    <LogOut size={16} />
                    Se déconnecter
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={() =>
                  navigate({ to: "/auth/sign-in", search: { redirect: "/" } })
                }
              >
                Se connecter
              </Button>
            )}
          </div>
        </section>
      </div>
    </header>
  );
}
