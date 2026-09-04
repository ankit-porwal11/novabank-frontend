import { lazy, Suspense, useEffect, useState } from "react";
import BankAiEmblemFallback from "./BankAiEmblem.fallback.jsx";
import Canvas3DErrorBoundary from "./Canvas3DErrorBoundary.jsx";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import { isWebGLAvailable } from "../../lib/webgl.js";
import "./BankAiEmblem.css";

const BankAiEmblem3D = lazy(() => import("./BankAiEmblem3D.jsx"));

export default function BankAiEmblem() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    setShouldRender3D(isWebGLAvailable() && !prefersReducedMotion && !(coarse && lowPower));
  }, [prefersReducedMotion]);

  if (!shouldRender3D) {
    return <BankAiEmblemFallback />;
  }

  return (
    <div className="bank-ai-emblem">
      <Canvas3DErrorBoundary fallback={<BankAiEmblemFallback />}>
        <Suspense fallback={<BankAiEmblemFallback />}>
          <BankAiEmblem3D reduceMotion={prefersReducedMotion} />
        </Suspense>
      </Canvas3DErrorBoundary>
    </div>
  );
}
