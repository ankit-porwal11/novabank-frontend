/**
 * Cheap, synchronous WebGL capability check. Used to decide up-front
 * whether it's worth lazy-loading the three.js/R3F chunk at all.
 */
export function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
