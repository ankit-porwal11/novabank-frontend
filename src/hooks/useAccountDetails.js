import { useQuery } from "@tanstack/react-query";
import { getAccountDetails } from "../api/account.api.js";
import { useAccountStore } from "../stores/accountStore.js";

/**
 * Wraps POST /account/details. A 404 here means "this user has no bank
 * account yet" — that's an expected, first-class state (not an error to
 * retry), so retry is disabled and callers should branch on `isNoAccount`
 * to render the empty state rather than a generic error screen.
 */
export function useAccountDetails(options = {}) {
  const setAccount = useAccountStore((s) => s.setAccount);
  const setNoAccount = useAccountStore((s) => s.setNoAccount);

  const query = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      try {
        const account = await getAccountDetails();
        setAccount(account);
        return account;
      } catch (err) {
        if (err.response?.status === 404) {
          setNoAccount();
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });

  const isNoAccount = query.error?.response?.status === 404;

  return { ...query, isNoAccount };
}
