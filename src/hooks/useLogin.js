import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api.js";
import { useAuthStore } from "../stores/authStore.js";
import { useUserStore } from "../stores/userStore.js";
import { notify } from "../lib/toast.js";

/**
 * POST /users/login. On success, hydrates both stores immediately (no need
 * to wait for a follow-up current-user fetch) and primes the query cache.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(["currentUser"], data.user);
      notify.success(`Welcome back, ${data.user.fullName?.split(" ")[0] || data.user.username}.`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Unable to sign in. Please try again.";
      notify.error(message);
    },
  });
}
