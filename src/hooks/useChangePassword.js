import { useMutation } from "@tanstack/react-query";
import { changeCurrentPassword } from "../api/auth.api.js";
import { notify } from "../lib/toast.js";

// PATCH /users/change-password
export function useChangePassword() {
  return useMutation({
    mutationFn: changeCurrentPassword,
    onSuccess: () => {
      notify.success("Password changed successfully.");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Could not change password. Please try again.";
      notify.error(message);
    },
  });
}
