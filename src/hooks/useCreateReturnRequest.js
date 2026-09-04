import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReturnRequest } from "../api/account.api.js";
import { notify } from "../lib/toast.js";

// POST /account/return-request/create
export function useCreateReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnRequests"] });
      notify.success("Return request submitted.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Couldn't submit return request.";
      notify.error(message);
    },
  });
}
