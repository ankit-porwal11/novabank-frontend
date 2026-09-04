/**
 * Shared formatters for the Account module. Overview, Details, and the
 * detail table were each formatting currency/dates/status locally with
 * copy-pasted logic — centralized here so a formatting change (or a future
 * currency other than INR) only has to happen once, and so every page is
 * guaranteed to render the same value the same way.
 */

export function formatCurrency(amount, currency = "INR") {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function titleCase(value) {
  if (!value) return "—";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

// Account.status (ACTIVE / FROZEN / CLOSED) — distinct from transaction
// status (SUCCESS / PENDING / FAILED / REVERSED), which TransactionRow
// maps separately since it's a different domain.
export const ACCOUNT_STATUS_TONE = {
  ACTIVE: "success",
  FROZEN: "warning",
  CLOSED: "danger",
};

export function accountStatusTone(status) {
  return ACCOUNT_STATUS_TONE[status] || "neutral";
}

// ReturnRequest.status (PENDING / APPROVED / REJECTED / EXPIRED) — see
// Backend/src/models/returnRequest.model.js.
export const RETURN_REQUEST_STATUS_TONE = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  EXPIRED: "neutral",
};

export function returnRequestStatusTone(status) {
  return RETURN_REQUEST_STATUS_TONE[status] || "neutral";
}

// ReturnRequest.settlementStatus (PENDING / PARTIAL / COMPLETED / EXPIRED).
export const SETTLEMENT_STATUS_TONE = {
  PENDING: "warning",
  PARTIAL: "warning",
  COMPLETED: "success",
  EXPIRED: "neutral",
};

export function settlementStatusTone(status) {
  return SETTLEMENT_STATUS_TONE[status] || "neutral";
}
