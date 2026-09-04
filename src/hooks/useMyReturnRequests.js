import { useQuery } from "@tanstack/react-query";
import { getMyReturnRequests } from "../api/account.api.js";

// GET /account/return-request/my-requests
export function useMyReturnRequests(options = {}) {
  return useQuery({
    queryKey: ["returnRequests", "mine"],
    queryFn: getMyReturnRequests,
    retry: 1,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
