import { create } from "zustand";

/**
 * User store — the current user's profile fields, kept in sync with the
 * `['currentUser']` TanStack Query cache via hooks/useCurrentUser.js.
 * Components read from here for instant, non-suspending access (sidebar
 * avatar, topbar name, etc.) without re-subscribing to the query everywhere.
 */
export const useUserStore = create((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUserFields: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),

  clearUser: () => set({ user: null }),
}));
