import { useEffect, useState } from "react";

/**
 * Tracks the user's OS-level reduced-motion preference so landing sections
 * can swap parallax/3D/scroll-pinning for simple fades or static content.
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
