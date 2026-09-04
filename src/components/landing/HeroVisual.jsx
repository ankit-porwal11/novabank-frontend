import { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeroCard3DFallback from "../three/HeroCard3D.fallback.jsx";
import Canvas3DErrorBoundary from "../three/Canvas3DErrorBoundary.jsx";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import { isWebGLAvailable } from "../../lib/webgl.js";

// Dynamic import — this is the ONLY place three.js / @react-three/fiber
// ever get pulled into a bundle. Vite splits it into its own chunk
// (see vite.config.js manualChunks), so the dashboard never downloads it.
const HeroCard3D = lazy(() => import("../three/HeroCard3D.jsx"));

const MOBILE_3D_THRESHOLD = 640;

export default function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldRender3D, setShouldRender3D] = useState(false);
  // A ref, not state — updated every scroll tick but read once per R3F
  // frame via useFrame, so scroll never triggers a React re-render.
  const scrollProgress = useRef(0);

  useEffect(() => {
    const isSmallViewport = window.innerWidth < MOBILE_3D_THRESHOLD;
    setShouldRender3D(!isSmallViewport && isWebGLAvailable());
  }, []);

  useEffect(() => {
    function handleScroll() {
      const max = window.innerHeight * 0.8;
      scrollProgress.current = Math.min(1, Math.max(0, window.scrollY / max));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!shouldRender3D) {
    return <HeroCard3DFallback />;
  }

  return (
    <Canvas3DErrorBoundary fallback={<HeroCard3DFallback />}>
      <Suspense fallback={<HeroCard3DFallback />}>
        <HeroCard3D reduceMotion={prefersReducedMotion} scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas3DErrorBoundary>
  );
}
