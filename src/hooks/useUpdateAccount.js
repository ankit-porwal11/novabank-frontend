import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccountDetails } from "../api/auth.api.js";
import { useUserStore } from "../stores/userStore.js";
import { notify } from "../lib/toast.js";

// PATCH /users/update-account
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const updateUserFields = useUserStore((s) => s.updateUserFields);

  return useMutation({
    mutationFn: updateAccountDetails,
    onSuccess: (updatedUser) => {
      updateUserFields(updatedUser);
      queryClient.setQueryData(["currentUser"], updatedUser);
      notify.success("Account details updated.");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Could not update account details.";
      notify.error(message);
    },
  });
}
