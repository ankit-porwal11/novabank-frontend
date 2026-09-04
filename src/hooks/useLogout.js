import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api.js";
import { useAuthStore } from "../stores/authStore.js";
import { useUserStore } from "../stores/userStore.js";
import { notify } from "../lib/toast.js";

/**
 * POST /users/logout. Always clears local state, even if the network call
 * fails (e.g. token already expired) — a stuck "logged in" UI is worse
 * than an unnecessary local reset.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const resetAuth = useAuthStore((s) => s.reset);
  const clearUser = useUserStore((s) => s.clearUser);

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      resetAuth();
      clearUser();
      queryClient.clear();
      notify.success("You have been signed out.");
    },
    onError: () => {
      // Local state is still cleared via onSettled; this just avoids a
      // silent failure being mistaken for success elsewhere.
    },
  });
}
