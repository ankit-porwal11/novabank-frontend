import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import FullPageLoader from "../components/ui/FullPageLoader.jsx";

/**
 * Gate for authenticated routes. Since the access token is httpOnly, the
 * frontend cannot know auth state synchronously on first paint — it probes
 * GET /users/current-user once and holds the gate with a loader until that
 * resolves, then trusts the Zustand auth store for subsequent renders.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authChecked = useAuthStore((s) => s.authChecked);

  const { isLoading } = useCurrentUser({
    enabled: !authChecked,
  });

  if (!authChecked && isLoading) {
    return <FullPageLoader label="Verifying your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
