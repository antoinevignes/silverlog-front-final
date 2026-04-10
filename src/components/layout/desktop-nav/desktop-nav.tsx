import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, LogOut, Search, Settings, Shield, X } from "lucide-react";
import "./desktop-nav.scss";
import { useAuth } from "@/auth";
import { useToggle } from "@/utils/use-toggle";
import SearchBar from "@/features/movie/components/search-bar/search-bar";
import NotificationBell from "@/features/notification/components/notification-bell";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import Button from "@/components/ui/button/button";
import { Avatar } from "@/components/ui/avatar/avatar";
import { Image } from "@unpic/react";

export default function DesktopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    value: isSearchOpen,
    toggle: toggleSearch,
    setFalse: closeSearch,
  } = useToggle();

  return (
    <header className="desktop-top-nav py-md">
      <div className="nav-container container">
        <Link to="/" className="brand gap-sm">
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
          <span className="brand-name font-fraunces">Silverlog</span>
        </Link>

        <nav className="main-nav">
          <ul className="gap-xl">
            <li>
              <Link to="/movies">Films</Link>
            </li>
            <li>
              <Link to="/discover">Découvrir</Link>
            </li>

            {user && (
              <li>
                <Link to="/user/activity">Activité</Link>
              </li>
            )}
          </ul>
        </nav>

        <section className="right-section">
          <div className={`search-container mr-md ${isSearchOpen ? "open" : ""}`}>
            <div className="search-wrapper">
              <SearchBar autoFocus={isSearchOpen} />
            </div>

            {isSearchOpen ? (
              <Button
                className="close-search"
                onClick={closeSearch}
                variant="ghost"
                size="icon"
                aria-label="Fermer la barre de recherche"
              >
                <X size={20} />
              </Button>
            ) : (
              <Button
                className="open-search"
                onClick={toggleSearch}
                variant="ghost"
                size="icon"
                aria-label="Ouvrir la barre de recherche"
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
                    <Avatar
                      username={user.username}
                      src={user.avatar_path}
                      size="md"
                    />
                  </div>
                </DropdownTrigger>

                <DropdownContent align="right">
                  <div className="dropdown-header gap-xs py-sm px-md">
                    <span className="username">{user.username}</span>
                    <span className="email">{user.email}</span>
                  </div>
                  <hr className="dropdown-divider my-xs" />
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
                  <hr className="dropdown-divider my-xs" />
                  {user.role === "admin" && (
                    <DropdownItem onClick={() => navigate({ to: "/admin" })}>
                      <Shield size={16} />
                      Administration
                    </DropdownItem>
                  )}
                  <DropdownItem
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                    }}
                  >
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
