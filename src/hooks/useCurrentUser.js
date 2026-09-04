import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api.js";
import { useAuthStore } from "../stores/authStore.js";
import { useUserStore } from "../stores/userStore.js";

/**
 * Wraps GET /users/current-user. Drives both stores:
 * - success  -> isAuthenticated: true, user populated
 * - 401/err  -> isAuthenticated: false, user cleared
 *
 * `enabled` lets callers (e.g. ProtectedRoute) control when this actually
 * fires, since it also doubles as the initial "am I logged in?" probe.
 */
export function useCurrentUser(options = {}) {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        setAuthenticated(true);
        return user;
      } catch (err) {
        clearUser();
        setAuthenticated(false);
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
