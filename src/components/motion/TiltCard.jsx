import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./TiltCard.css";

/**
 * Wraps any card content with a subtle 3D tilt + moving glass sheen that
 * tracks the cursor. Used across dashboard cards, feature cards, and
 * settings cards so "premium hover" feels identical everywhere instead of
 * being redefined per section. Degrades to a plain wrapper on touch
 * devices (no hover) automatically via the pointer:fine media check.
 */
export default function TiltCard({ children, className = "", maxTilt = 6, glare = true }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  function handlePointerMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {glare && (
        <motion.div
          className="tilt-card__glare"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(320px circle at ${gx}% ${gy}%, rgba(255,255,255,0.08), transparent 60%)`
            ),
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.div>
  );
}
