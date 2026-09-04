import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Tracks pointer position within a container, normalized to -0.5..0.5 on
 * each axis, smoothed with a spring. Multiple hero layers read from the
 * same values at different `intensity` multipliers to create depth
 * (background moves least, foreground card moves most).
 */
export function useMouseParallax(ref) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 60, damping: 18, mass: 0.4 });

  useEffect(() => {
    const node = ref?.current || window;

    function handleMove(e) {
      const rect = ref?.current
        ? ref.current.getBoundingClientRect()
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    node.addEventListener("mousemove", handleMove);
    return () => node.removeEventListener("mousemove", handleMove);
  }, [ref, x, y]);

  return { x: springX, y: springY };
}
