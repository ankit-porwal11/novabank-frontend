import axios from "axios";

/**
 * Central Axios instance.
 *
 * Auth model (mirrors Backend/src/middleware/auth.middleware.js exactly):
 * - accessToken / refreshToken are httpOnly cookies set by the server.
 * - The browser sends them automatically on same-origin/credentialed
 *   requests — the frontend never reads or stores them in JS.
 * - `withCredentials: true` is required on every request for cookies to
 *   be sent and set cross-origin.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// ---------------------------------------------------------------------------
// Automatic refresh-token handling
// ---------------------------------------------------------------------------
// When an access token expires, verifyJWT on the backend returns 401.
// We attempt exactly one silent POST /users/refresh-token, then retry the
// original request once. If refresh also fails, we let the 401 propagate so
// the auth store / ProtectedRoute can log the user out.

let isRefreshing = false;
let pendingQueue = [];

function resolvePendingQueue(error) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/users/login") ||
      originalRequest?.url?.includes("/users/register") ||
      originalRequest?.url?.includes("/users/refresh-token");

    if (status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh resolves.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(() => axiosClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axiosClient.post("/users/refresh-token");
      resolvePendingQueue(null);
      return axiosClient(originalRequest);
    } catch (refreshError) {
      resolvePendingQueue(refreshError);
      // Let listeners (authStore) know the session is truly gone.
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
