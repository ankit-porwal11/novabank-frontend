/**
 * Order module status/formatting helpers.
 *
 * IMPORTANT: unlike the Account module, no backend source was provided for
 * Order/Address — per this task's explicit instructions, backend.zip was
 * not re-analyzed and these APIs are treated as a given source of truth.
 * Field names used here (itemType, status, trackingNumber, currentLocation,
 * customerAccepted, isCompleted, orderId/_id, a per-order history/timeline
 * array) are taken directly from the terminology the spec itself uses —
 * not fabricated, but also not verified against real backend response
 * bodies the way every Account/Transfer field was. If actual responses use
 * different keys, only this file and the thin API layer in order.api.js
 * should need to change — every component reads through these helpers.
 */

// Exact status → color mapping per spec section "Status Colors".
export const STATUS_COLOR = {
  ORDER_REQUESTED: "blue",
  TRACKING_GENERATED: "purple",
  IN_TRANSIT: "orange",
  OUT_FOR_DELIVERY: "yellow",
  AWAITING_CUSTOMER_ACCEPTANCE: "amber",
  DELIVERED: "green",
  DELIVERY_FAILED: "red",
  RETURNED_TO_BRANCH: "red",
  BRANCH_VISIT_REQUIRED: "darkred",
};

// Maps the spec's custom color names onto the existing Badge tone system
// (neutral | primary | success | danger | warning) so no new Badge
// variants are needed — reuses the shared component as-is.
const COLOR_TO_BADGE_TONE = {
  blue: "primary",
  purple: "primary",
  orange: "warning",
  yellow: "warning",
  amber: "warning",
  green: "success",
  red: "danger",
  darkred: "danger",
};

export function orderStatusTone(status) {
  return COLOR_TO_BADGE_TONE[STATUS_COLOR[status]] || "neutral";
}

// CSS custom-property name (defined in order.css) for the exact spec
// colors, used where a Badge's 5-tone system isn't granular enough (e.g.
// the timeline dots, which need to visually distinguish orange/yellow/amber).
export function orderStatusColorVar(status) {
  const color = STATUS_COLOR[status];
  return color ? `var(--order-status-${color})` : "var(--color-text-faint)";
}

export function orderStatusLabel(status) {
  if (!status) return "—";
  return status
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export const ITEM_TYPE_LABEL = {
  PASSBOOK: "Passbook",
  CHEQUE_BOOK: "Cheque Book",
  DEBIT_CARD: "Debit Card",
};

export function itemTypeLabel(itemType) {
  return ITEM_TYPE_LABEL[itemType] || itemType || "—";
}

/**
 * Bug fix: OrderTrackPage previously read order.trackingNumber,
 * order.currentLocation, and order.itemType directly with no fallback.
 * If the backend uses different key names for these, the UI always fell
 * back to "Not generated yet" / "—" / "—" even when real data existed.
 * These helpers check several plausible real field-name variants — they
 * never invent a value; if none of the checked keys exist, the caller's
 * own fallback text still applies exactly as before.
 */
export function getOrderTrackingNumber(order) {
  if (!order) return null;
  return (
    order.trackingNumber ||
    order.tracking_number ||
    order.trackingId ||
    order.tracking_id ||
    order.awbNumber ||
    order.awb ||
    null
  );
}

export function getOrderCurrentLocation(order) {
  if (!order) return null;
  return (
    order.currentLocation ||
    order.current_location ||
    order.location ||
    order.currentCity ||
    order.lastLocation ||
    null
  );
}

export function getOrderItemType(order) {
  if (!order) return null;
  return order.itemType || order.item_type || order.productType || order.product_type || null;
}

// Spec section "Duplicate Product Order Prevention" — exact active-status
// set that blocks placing another order of the same itemType.
export const ACTIVE_ORDER_STATUSES = new Set([
  "ORDER_REQUESTED",
  "TRACKING_GENERATED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "AWAITING_CUSTOMER_ACCEPTANCE",
  "RETURNED_TO_BRANCH",
]);

export function isActiveOrderStatus(status) {
  return ACTIVE_ORDER_STATUSES.has(status);
}

// Finds an existing active order of the given itemType within a list of
// orders (as returned by GET /order/current), for the duplicate-order and
// URL-manipulation guards.
export function findActiveOrderOfType(orders, itemType) {
  if (!Array.isArray(orders)) return null;
  return (
    orders.find((o) => o.itemType === itemType && isActiveOrderStatus(o.status)) || null
  );
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Spec corner case #10 "Network Failure" — a true network failure (no
// response reached at all) must show a friendly message, not a raw/technical
// one. A real error response from the server (validation, business-rule
// rejection, etc.) still shows the backend's own message, since that's
// meaningful to the user, not "generic technical".
export function friendlyOrderErrorMessage(error) {
  if (!error?.response) {
    return "Server is temporarily unavailable. Please try again.";
  }
  return error.response?.data?.message || "Server is temporarily unavailable. Please try again.";
}
