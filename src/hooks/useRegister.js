import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth.api.js";
import { notify } from "../lib/toast.js";

/**
 * POST /users/register. Registration does not log the user in (backend
 * issues no cookies on this route) — success routes to /login.
 */
export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      notify.success("Account created. Please sign in to continue.");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Registration failed. Please check your details.";
      notify.error(message);
    },
  });
}
