import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, LogOut, Search, Settings, X } from "lucide-react";
import "./desktop-nav.scss";
import { useState } from "react";
import { useAuth } from "@/auth";
import SearchBar from "@/components/layout/search-bar/search-bar";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button/button";
import { Image } from "@unpic/react";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";

export default function DesktopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  console.log(user);

  return (
    <header className="desktop-top-nav">
      <div className="nav-container container">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="Silverlog logo" className="logo" />
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
              <button
                className="close-search"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={20} />
              </button>
            ) : (
              <button
                className="open-search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </button>
            )}
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
                        alt={user.username}
                        background={getCloudinaryPlaceholder(
                          user.avatar_path,
                          "avatars",
                        )}
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
