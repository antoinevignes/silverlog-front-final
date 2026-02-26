import { Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import SearchBar from "@/components/layout/search-bar/search-bar";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { logout, user } = useAuth();

  console.log(user);

  return (
    <div>
      <SearchBar />

      <h1>Home</h1>
      <p>{user?.username}</p>
      <button onClick={logout}>Logout</button>
      <Link search={{ redirect: "/" }} to="/auth/sign-in">
        Login
      </Link>
    </div>
  );
}
