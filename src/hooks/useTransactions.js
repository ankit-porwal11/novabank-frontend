import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/account.api.js";

// GET /account/transaction
export function useTransactions(options = {}) {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    retry: 1,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
