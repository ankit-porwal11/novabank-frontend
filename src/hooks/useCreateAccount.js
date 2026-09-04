import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "../api/account.api.js";
import { useAccountStore } from "../stores/accountStore.js";
import { notify } from "../lib/toast.js";

// POST /account/create
export function useCreateAccount() {
  const queryClient = useQueryClient();
  const setAccount = useAccountStore((s) => s.setAccount);

  return useMutation({
    mutationFn: createAccount,
    onSuccess: (createdAccount) => {
      setAccount(createdAccount);
      // The create response and the /details response have different
      // shapes (create returns the raw Account document; details returns
      // the computed balance view) — invalidate so the next read of
      // ['account'] refetches the authoritative, balance-inclusive shape.
      queryClient.invalidateQueries({ queryKey: ["account"] });
      notify.success("Account created successfully.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Could not create account.";
      notify.error(message);
    },
  });
}
