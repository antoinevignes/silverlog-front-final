import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import SearchBar from "@/components/layout/search-bar/search-bar";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user } = useAuth();

  console.log(user);

  return (
    <div>
      <div className="mobile-only-search" style={{ display: "block" }}>
        <style>{`
          @media (min-width: 768px) {
            .mobile-only-search {
              display: none !important;
            }
          }
        `}</style>
        <SearchBar />
      </div>
    </div>
  );
}
