import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferMoney } from "../api/account.api.js";
import { notify } from "../lib/toast.js";

// POST /account/transfer
export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferMoney,
    onSuccess: () => {
      // Balance and transaction history both changed — refetch both.
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Transfer failed. Please try again.";
      notify.error(message);
    },
  });
}
