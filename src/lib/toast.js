import toast from "react-hot-toast";

/**
 * Thin wrapper so call sites read intent-first ("notify.success(...)")
 * and we have one place to change toast behavior later.
 */
export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
};
