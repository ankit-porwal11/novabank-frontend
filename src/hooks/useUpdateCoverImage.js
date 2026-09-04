import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserCoverImage } from "../api/auth.api.js";
import { useUserStore } from "../stores/userStore.js";
import { notify } from "../lib/toast.js";

// PATCH /users/cover-image
export function useUpdateCoverImage() {
  const queryClient = useQueryClient();
  const updateUserFields = useUserStore((s) => s.updateUserFields);

  return useMutation({
    mutationFn: updateUserCoverImage,
    onSuccess: (updatedUser) => {
      updateUserFields(updatedUser);
      queryClient.setQueryData(["currentUser"], updatedUser);
      notify.success("Cover image updated.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Could not update cover image.";
      notify.error(message);
    },
  });
}
