import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import FullPageLoader from "../components/ui/FullPageLoader.jsx";

/**
 * Gate for /login and /register — bounces already-authenticated users
 * straight to the dashboard instead of showing them the auth forms again.
 */
export default function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authChecked = useAuthStore((s) => s.authChecked);

  const { isLoading } = useCurrentUser({
    enabled: !authChecked,
  });

  if (!authChecked && isLoading) {
    return <FullPageLoader label="Loading…" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
