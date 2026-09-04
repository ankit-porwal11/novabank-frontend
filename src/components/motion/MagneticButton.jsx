import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Makes its single child button gently follow the cursor within a small
 * radius, then spring back on leave — the "magnetic button" effect used
 * on the hero and final CTA. Wraps only; never changes the button's own
 * onClick/type/logic.
 */
export default function MagneticButton({ children, strength = 18, fullWidth = false, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18 });
  const springY = useSpring(y, { stiffness: 240, damping: 18 });

  function handlePointerMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY, display: fullWidth ? "block" : "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
