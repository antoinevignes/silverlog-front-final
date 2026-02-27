import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, LogOut, Search, Settings, User, X } from "lucide-react";
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

export default function DesktopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                    <User size={20} />
                  </div>
                </DropdownTrigger>
                <DropdownContent align="right">
                  <div className="dropdown-header">
                    <span className="username">{user.username}</span>
                    <span className="email">{user.email}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <DropdownItem
                    onClick={() => navigate({ to: "/user/activity" })}
                  >
                    <BookOpen size={16} />
                    Mon Profil
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate({ to: "/" })}>
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
