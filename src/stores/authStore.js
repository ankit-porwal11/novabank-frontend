import { create } from "zustand";

/**
 * Auth store — holds only client-derived auth STATE (not server data).
 * Server data (the user object) lives in userStore / TanStack Query cache.
 * Mutations themselves (login/register/etc network calls) live in
 * hooks/use*.js via TanStack Query — this store just reflects outcomes.
 */
export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  authChecked: false, // has the initial current-user probe run at least once?
  isLoading: false,
  error: null,

  setAuthenticated: (value) =>
    set({ isAuthenticated: value, authChecked: true, error: null }),

  setLoading: (value) => set({ isLoading: value }),

  setError: (message) => set({ error: message }),

  clearError: () => set({ error: null }),

  markAuthChecked: () => set({ authChecked: true }),

  /** Called by hooks/useLogout and by the axios session-expired listener. */
  reset: () =>
    set({
      isAuthenticated: false,
      authChecked: true,
      isLoading: false,
      error: null,
    }),
}));

// Listen for the axios interceptor telling us refresh has definitively failed.
if (typeof window !== "undefined") {
  window.addEventListener("auth:session-expired", () => {
    useAuthStore.getState().reset();
  });
}
