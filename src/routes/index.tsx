import { useAuth } from "@/auth";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { logout, user } = useAuth();

  console.log(user);

  return (
    <div>
      <h1>Home</h1>
      <p>{user?.username}</p>
      <button onClick={logout}>Logout</button>
      <Link search={{ redirect: "/" }} to="/auth/sign-in">
        Login
      </Link>
    </div>
  );
}
