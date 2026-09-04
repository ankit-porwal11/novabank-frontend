/**
 * Frontend-only "return request eligibility window" for recent transfers.
 *
 * This is a demo/UX feature, not a backend rule: the backend has no concept
 * of a 3-hour window and remains the final authority on whether a return
 * request can actually be created (see createReturnRequest in
 * src/api/account.api.js). This module only decides what the Account
 * Overview UI *offers* — it never bypasses or replaces backend validation.
 *
 * Data source: the existing GET /account/transaction passbook entries
 * (see getTransactions in src/api/account.api.js, already fetched via
 * useTransactions()). Confirmed against a real live payload: these entries
 * carry { type, direction, amount, description, status, balanceAfter,
 * createdAt, from?, to? } — and genuinely no id/_id field at all. That is
 * the passbook's actual shape, not a bug in this module.
 *
 * Transaction id: the ONLY existing frontend data source that carries a
 * transfer's real backend id is the raw response of transferMoney() (POST
 * /account/transfer — see account.api.js), which TransferSuccessPage
 * already uses via `transaction._id` in router state, right after a
 * transfer completes. That object isn't retrievable again later from any
 * list endpoint. So recordRecentTransfer() below captures that exact same
 * real id (called once, from TransferPage.jsx's onSuccess — the same call
 * site TransferSuccessPage's state already comes from) and keeps it
 * client-side, keyed to the transfer's own amount/recipient/createdAt, for
 * its 3-hour window. getTransactionId() then matches a passbook entry back
 * to that persisted real id. If no persisted entry matches, the id stays
 * null and the transaction is correctly excluded — never guessed.
 *
 * Matching is intentionally case/whitespace-insensitive on type/direction/
 * status, and the timestamp check falls back to a couple of alternate
 * field names if `createdAt` isn't present. TransactionRow.jsx itself uses
 * strict, uppercase equality for these same fields and is confirmed
 * working against real data, so an exact match is expected in the normal
 * case — this is defensive slack for whatever the live payload turns out
 * to actually contain, not a loosening of the eligibility rule itself.
 *
 * Known limitation: GET /account/return-request/my-requests currently only
 * returns requests where the caller is the approver, not ones they created
 * as sender (documented in getMyReturnRequests, src/api/account.api.js).
 * That means there is no existing, reliable frontend signal for "this sent
 * transfer already has a return request against it" — so this module does
 * not attempt to filter on that. The existing return-request creation flow
 * (and the backend) is still the final word if a duplicate is attempted.
 */

export const RETURN_REQUEST_WINDOW_MS = 3 * 60 * 60 * 1000; // 3 hours

// Timestamp field candidates, in priority order. createdAt is the
// documented field (see getTransactions above); the others are only used
// as a fallback if createdAt is missing, in case the live payload differs
// from the documented shape.
const TIMESTAMP_FIELDS = ["createdAt", "created_at", "date", "timestamp"];

// Client-side record of transfers this browser has just made, so their
// real id (only available at transfer time — see module doc above) can
// still be found later when the same transfer shows up, id-less, in the
// passbook. localStorage (not memory) so it survives a refresh, as
// required.
const RECENT_TRANSFERS_STORAGE_KEY = "novabank:recent-transfers-v1";

// Safety margin for matching a persisted entry to a passbook entry when
// their createdAt strings aren't byte-identical (e.g. minor formatting
// differences between the two endpoints). An exact createdAt match is
// tried first; this is only the fallback.
const MATCH_TOLERANCE_MS = 5 * 60 * 1000;

function readRecentTransfers() {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(RECENT_TRANSFERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecentTransfers(entries) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(RECENT_TRANSFERS_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable/full — persistence silently no-ops; a
    // transaction just won't be matchable, which correctly resolves to
    // "not eligible" rather than throwing.
  }
}

// Drops entries whose own 3-hour window has already passed, so the store
// never grows unbounded and an expired transfer can never resurface.
function pruneExpired(entries, now = Date.now()) {
  return entries.filter((entry) => {
    const created = new Date(entry.createdAt).getTime();
    return !Number.isNaN(created) && now < created + RETURN_REQUEST_WINDOW_MS;
  });
}

/**
 * Call once, right when a transfer succeeds (TransferPage.jsx's onSuccess),
 * with the exact same `transaction` object and `receiverAccountNumber`
 * TransferSuccessPage already receives via router state. Persists the
 * real id client-side for this transfer's 3-hour window so it can later
 * be matched against its (id-less) passbook entry. No-op if the response
 * doesn't actually have a real id — this never invents one.
 */
export function recordRecentTransfer(transaction, receiverAccountNumber) {
  const id = transaction?.id || transaction?._id;
  if (!id) return;
  const entry = {
    id,
    amount: transaction.amount,
    receiverAccountNumber: receiverAccountNumber || null,
    createdAt: transaction.createdAt || new Date().toISOString(),
  };
  const existing = pruneExpired(readRecentTransfers());
  writeRecentTransfers([...existing, entry]);
}

// Client-side record of which transactions this browser has successfully
// created a return request for. GET /account/return-request/my-requests
// can't answer this — see module doc above: it only ever returns requests
// where the caller is the approver, never ones created as sender, which is
// every transaction this feature deals with. So the moment of success on
// the existing ReturnRequestCreatePage (which already knows the real
// transactionId it just used) is captured here instead — real
// confirmation, not a guess. Same 3-hour horizon as recent transfers:
// once a transaction ages out of the eligible list it doesn't need to be
// tracked here anymore. Known limitation: this only reflects requests
// created through this app in this browser — it can't see one created via
// a different browser/device or after localStorage is cleared.
const REQUESTED_TRANSACTIONS_STORAGE_KEY = "novabank:requested-transactions-v1";

function readRequestedTransactions() {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(REQUESTED_TRANSACTIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRequestedTransactions(entries) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(REQUESTED_TRANSACTIONS_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable/full — persistence silently no-ops; the
    // button just won't show as disabled, same as before this feature.
  }
}

function pruneExpiredRequested(entries, now = Date.now()) {
  return entries.filter((entry) => {
    const recordedAt = new Date(entry.recordedAt).getTime();
    return !Number.isNaN(recordedAt) && now < recordedAt + RETURN_REQUEST_WINDOW_MS;
  });
}

/**
 * Call once, right when createReturnRequest() succeeds
 * (ReturnRequestCreatePage.jsx's onSuccess), with the exact real
 * transactionId that call already used. No-op on a falsy id — never
 * records a fabricated one.
 */
export function recordReturnRequestCreated(transactionId) {
  if (!transactionId) return;
  const existing = pruneExpiredRequested(readRequestedTransactions());
  if (existing.some((entry) => entry.transactionId === transactionId)) return;
  writeRequestedTransactions([...existing, { transactionId, recordedAt: new Date().toISOString() }]);
}

/** Has this browser already successfully created a return request for this exact transaction? */
export function hasReturnRequestBeenCreated(transactionId) {
  if (!transactionId) return false;
  const entries = pruneExpiredRequested(readRequestedTransactions());
  return entries.some((entry) => entry.transactionId === transactionId);
}

// Best-effort, non-fabricating match between a passbook transaction and a
// persisted real id. Prefers an exact createdAt match (the passbook entry
// and the raw transferMoney() response describe the same underlying
// document, so their createdAt should be identical); falls back to
// amount + recipient with a tight time tolerance only if no exact match
// exists. Returns null — never a guess — if nothing lines up safely.
function matchPersistedTransferId(transaction) {
  const txnCreatedAt = getTransactionTimestamp(transaction);
  if (!txnCreatedAt) return null;
  const entries = pruneExpired(readRecentTransfers());
  if (entries.length === 0) return null;

  const exact = entries.find((entry) => entry.createdAt === txnCreatedAt);
  if (exact) return exact.id;

  const txnTime = new Date(txnCreatedAt).getTime();
  if (Number.isNaN(txnTime)) return null;
  const recipient = transaction.to?.accountNumber || null;

  let best = null;
  let bestDelta = Infinity;
  for (const entry of entries) {
    if (entry.amount !== transaction.amount) continue;
    if (recipient && entry.receiverAccountNumber && entry.receiverAccountNumber !== recipient) {
      continue;
    }
    const entryTime = new Date(entry.createdAt).getTime();
    if (Number.isNaN(entryTime)) continue;
    const delta = Math.abs(entryTime - txnTime);
    if (delta <= MATCH_TOLERANCE_MS && delta < bestDelta) {
      best = entry;
      bestDelta = delta;
    }
  }
  return best ? best.id : null;
}

export function getTransactionId(transaction) {
  return transaction?.id || transaction?._id || matchPersistedTransferId(transaction) || null;
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : value;
}

function getTransactionTimestamp(transaction) {
  if (!transaction) return null;
  for (const field of TIMESTAMP_FIELDS) {
    if (transaction[field]) return transaction[field];
  }
  return null;
}

// The transfer's own eligibility deadline, independent of any other
// transaction — each transfer gets its own 3-hour clock from its own
// timestamp, never a single shared timer.
export function getReturnRequestExpiry(transaction) {
  const raw = getTransactionTimestamp(transaction);
  if (!raw) return null;
  const created = new Date(raw).getTime();
  if (Number.isNaN(created)) return null;
  return created + RETURN_REQUEST_WINDOW_MS;
}

export function isEligibleForReturnRequest(transaction, now = Date.now()) {
  if (!transaction) return false;
  if (!getTransactionId(transaction)) return false;
  // A transfer, successfully completed, where this account was the sender
  // (money left the account — the existing passbook already marks that as
  // "DEBIT", the same field TransactionRow uses to show the − / + sign).
  if (normalize(transaction.type) !== "TRANSFER") return false;
  if (normalize(transaction.direction) !== "DEBIT") return false;
  if (normalize(transaction.status) !== "SUCCESS") return false;
  const expiry = getReturnRequestExpiry(transaction);
  if (expiry === null) return false;
  return now < expiry;
}

// Most-recent-first, matching how transfers are naturally scanned.
export function getEligibleReturnTransfers(transactions, now = Date.now()) {
  return (transactions || [])
    .filter((transaction) => isEligibleForReturnRequest(transaction, now))
    .sort((a, b) => new Date(getTransactionTimestamp(b)) - new Date(getTransactionTimestamp(a)));
}

export function formatRemainingTime(transaction, now = Date.now()) {
  const expiry = getReturnRequestExpiry(transaction);
  if (expiry === null) return "";
  const remainingMs = Math.max(0, expiry - now);
  const totalMinutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0 && minutes <= 0) return "Expiring now";
  if (hours <= 0) return `${minutes}m remaining`;
  return `${hours}h ${minutes}m remaining`;
}

// Dev-only diagnostic: if there are transactions but none qualify, print
// exactly why the most recent one was excluded, so a real mismatch in the
// live payload (a field name/casing/value we haven't seen) is immediately
// visible in the browser console instead of silently showing "no eligible
// transfers". No-op in production builds and never affects the UI.
export function debugEligibility(transactions, now = Date.now()) {
  if (typeof window === "undefined" || !import.meta.env.DEV) return;
  if (!transactions || transactions.length === 0) return;
  if (getEligibleReturnTransfers(transactions, now).length > 0) return;

  const newest = [...transactions].sort(
    (a, b) => new Date(getTransactionTimestamp(b)) - new Date(getTransactionTimestamp(a))
  )[0];
  if (!newest) return;

  const expiry = getReturnRequestExpiry(newest);
  // eslint-disable-next-line no-console
  console.warn(
    "[ReturnRequestEligibilityCard] No eligible transfers. Most recent transaction was excluded because:",
    {
      transaction: newest,
      id: getTransactionId(newest),
      type: newest.type,
      direction: newest.direction,
      status: newest.status,
      timestampFieldUsed: TIMESTAMP_FIELDS.find((f) => newest[f]) || "(none found)",
      rawTimestampValue: getTransactionTimestamp(newest),
      parsedExpiry: expiry ? new Date(expiry).toISOString() : null,
      nowIso: new Date(now).toISOString(),
      failedBecause: {
        missingId: !getTransactionId(newest),
        typeNotTransfer: normalize(newest.type) !== "TRANSFER",
        directionNotDebit: normalize(newest.direction) !== "DEBIT",
        statusNotSuccess: normalize(newest.status) !== "SUCCESS",
        noValidTimestamp: expiry === null,
        pastExpiry: expiry !== null && now >= expiry,
      },
    }
  );
}
