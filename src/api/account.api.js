import axiosClient from "./axiosClient.js";

/**
 * Account API — mirrors Backend/src/routes/account.routes.js.
 *
 * Phase 2.1 + 2.2 scope: create, details, transactions, transfer, and
 * return-request creation/listing. Deposit and withdraw endpoints already
 * exist on the backend (see Backend/src/controllers/account.controller.js)
 * but are intentionally NOT wired here — out of scope for this module so far.
 *
 * Every function returns `response.data.data` (the `data` field of
 * ApiResponse), so callers work with the resource directly.
 */

// POST /account/create
// No request body. Throws (400) if the caller already has an account.
export async function createAccount() {
  const response = await axiosClient.post("/account/create");
  return response.data.data;
}

// POST /account/details
// Backend derives the account from the authenticated session (req.user._id)
// — it does not read anything from the request body. Returns
// { accountNumber, accountType, currency, balance, user }.
export async function getAccountDetails() {
  const response = await axiosClient.post("/account/details");
  return response.data.data;
}

// GET /account/transaction
// Returns passbook-style entries: { type, direction, amount, description,
// status, balanceAfter, createdAt, from?, to? } — direction/from/to are
// derived server-side in Backend/src/controllers/transaction.controller.js.
export async function getTransactions() {
  const response = await axiosClient.get("/account/transaction");
  return response.data.data;
}

// POST /account/transfer
// Backend/src/controllers/transfer.controller.js requires exactly these
// three fields (note the backend's own spelling: "idempotencKey", not
// "idempotencyKey"). amount must be a positive integer, max 50000 — the
// backend enforces this itself; the frontend mirrors it for UX only.
// Returns the created Transaction document (fromAccount/toAccount are
// raw ObjectIds, not populated account numbers).
export async function transferMoney({ receiverAccountNumber, amount, idempotencKey }) {
  const response = await axiosClient.post("/account/transfer", {
    receiverAccountNumber,
    amount,
    idempotencKey,
  });
  return response.data.data;
}

// POST /account/return-request/create
// Verified working endpoint (confirmed via Postman): creates a return
// request for the given transaction. transactionId is sent in the body
// only — no URL param.
export async function createReturnRequest({ transactionId, reason }) {
  const response = await axiosClient.post("/account/return-request/create", {
    transactionId,
    reason,
  });
  return response.data.data;
}

// GET /account/return-request/my-requests
// Returns ReturnRequest documents: { originalTransaction, requesterAccount,
// approverAccount, totalAmount, settledAmount, remainingAmount, reason,
// status, settlementStatus, expiresAt, returnTransactions, createdAt }.
//
// Known backend limitation (Backend/src/controllers/returnRequest.controller.js,
// getMyReturnRequests): its query is
//   { $or: [{ senderAccount: account._id }, { approverAccount: account._id }] }
// but the ReturnRequest schema field is "requesterAccount", not
// "senderAccount" — that clause never matches anything. In practice this
// endpoint currently only returns requests where the caller is the
// APPROVER (i.e. requests made against them), not ones they created as
// sender. This is a pre-existing backend bug, out of scope to fix this
// phase — documented here so it isn't mistaken for a frontend defect.
export async function getMyReturnRequests() {
  const response = await axiosClient.get("/account/return-request/my-requests");
  return response.data.data;
}
