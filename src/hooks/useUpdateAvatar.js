import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAvatar } from "../api/auth.api.js";
import { useUserStore } from "../stores/userStore.js";
import { notify } from "../lib/toast.js";

// PATCH /users/avatar
export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const updateUserFields = useUserStore((s) => s.updateUserFields);

  return useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: (updatedUser) => {
      updateUserFields(updatedUser);
      queryClient.setQueryData(["currentUser"], updatedUser);
      notify.success("Profile photo updated.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Could not update profile photo.";
      notify.error(message);
    },
  });
}
