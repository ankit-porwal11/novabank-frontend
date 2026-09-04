import { create } from "zustand";

/**
 * Account store — the current user's bank account snapshot, kept in sync
 * with the `['account']` TanStack Query cache via hooks/useAccountDetails.js.
 * Mirrors stores/userStore.js exactly, so future Account module pages
 * (Transfer, Deposit, Withdraw, Return Requests — Phase 2.2) can read the
 * live balance/account number instantly without re-subscribing to the
 * query everywhere.
 */
export const useAccountStore = create((set) => ({
  account: null,
  hasAccount: null, // null = unknown yet, false = confirmed no account, true = confirmed exists

  setAccount: (account) => set({ account, hasAccount: true }),

  setNoAccount: () => set({ account: null, hasAccount: false }),

  updateAccountFields: (partial) =>
    set((state) => ({
      account: state.account ? { ...state.account, ...partial } : state.account,
    })),

  clearAccount: () => set({ account: null, hasAccount: null }),
}));
