import SearchBar from "@/features/movie/components/search-bar/search-bar";
import NotificationBell from "@/features/notification/components/notification-bell";
import "./mobile-home-header.scss";

export function MobileHomeHeader() {
  return (
    <header className="container mobile-home-header">
      <SearchBar />
      <NotificationBell />
    </header>
  );
}

export default MobileHomeHeader;
