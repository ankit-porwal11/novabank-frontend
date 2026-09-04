import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAddress,
  getMyAddresses,
  createOrder,
  getCurrentOrders,
  getOrderDetails,
  trackOrderByNumber,
  redispatchOrder,
  acceptOrder,
  getOrderHistory
} from "../api/order.api.js";
import { notify } from "../lib/toast.js";
import { friendlyOrderErrorMessage } from "../components/order/orderFormat.js";

// GET /order/current — source for Overview (summary + active list) and
// History (full lifecycle). Used by every screen's duplicate-order guard
// too. Polls every 30s (same cadence as tracking) so a page left open
// picks up backend-side status changes — e.g. an order re-entering
// OUT_FOR_DELIVERY after a redispatch — without requiring a manual
// refresh or remount.
export function useCurrentOrders(options = {}) {
  return useQuery({
    queryKey: ["orders", "current"],
    queryFn: getCurrentOrders,
    retry: 1,
    staleTime: 20 * 1000,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// GET /order/details/:orderId — spec corner case #11 "Refresh Protection":
// this is the single source of truth re-read on every mount, so a page
// refresh always restores real state instead of relying on client memory.
export function useOrderDetails(orderId, options = {}) {
  return useQuery({
    queryKey: ["orders", "details", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: Boolean(orderId),
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// GET /order/track/:trackingNumber — spec corner case #4 "Track Now": cache
// the data and refresh every 30s rather than refetching on every render or
// interaction. refetchInterval handles the 30s refresh; staleTime keeps
// TanStack Query from firing an extra fetch on remount within that window.
export function useTrackOrder(trackingNumber, options = {}) {
  return useQuery({
    queryKey: ["orders", "track", trackingNumber],
    queryFn: () => trackOrderByNumber(trackingNumber),
    enabled: Boolean(trackingNumber),
    retry: 1,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// GET /address/my-addresses
export function useMyAddresses(options = {}) {
  return useQuery({
    queryKey: ["addresses", "mine"],
    queryFn: getMyAddresses,
    retry: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// POST /address/add
export function useAddAddress() {
  return useMutation({
    mutationFn: addAddress,
    onError: (error) => notify.error(friendlyOrderErrorMessage(error)),
  });
}

// POST /order/create
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => notify.error(friendlyOrderErrorMessage(error)),
  });
}

// POST /order/redispatch/:orderId
export function useRedispatchOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: redispatchOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      notify.success("Redispatch requested.");
    },
    onError: (error) => notify.error(friendlyOrderErrorMessage(error)),
  });
}

// GET /order/accept-order/:orderId
export function useAcceptOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      notify.success("Order accepted.");
    },
    onError: (error) => notify.error(friendlyOrderErrorMessage(error)),
  });
}


export function useOrderHistory(options = {}) {
  return useQuery({
    queryKey: ["orders", "history"],
    queryFn: getOrderHistory,
    retry: 1,
    staleTime: 20000,
    refetchInterval: 30000,
    ...options,
  });
}