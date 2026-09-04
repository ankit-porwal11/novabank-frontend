import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION } from "./motion.js";
import { useReducedMotion } from "./useReducedMotion.js";

/**
 * Attaches a fade/rise-in reveal to every [data-reveal] child of the
 * returned ref, triggered as each element enters the viewport. One hook,
 * reused across every landing section, so timing stays consistent and each
 * section file doesn't hand-roll its own ScrollTrigger boilerplate.
 *
 * Pass `stagger: true` to stagger children of a single [data-reveal-group]
 * instead of animating each [data-reveal] independently.
 */
export function useScrollReveal({ deps = [] } = {}) {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (prefersReduced) {
      // Skip animation entirely — content is already visible in the DOM.
      return undefined;
    }

    const ctx = gsap.context(() => {
      const groups = container.querySelectorAll("[data-reveal-group]");
      groups.forEach((group) => {
        const items = group.querySelectorAll("[data-reveal]");
        if (!items.length) return;
        gsap.from(items, {
          opacity: 0,
          y: 28,
          duration: MOTION.duration.base,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          scrollTrigger: {
            trigger: group,
            start: "top 82%",
            once: true,
          },
        });
      });

      // Standalone reveal targets not inside a group.
      const standalone = container.querySelectorAll(
        ":scope > [data-reveal], [data-reveal]:not([data-reveal-group] [data-reveal])"
      );
      standalone.forEach((el) => {
        if (el.closest("[data-reveal-group]")) return;
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: MOTION.duration.base,
          ease: MOTION.ease,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, ...deps]);

  return containerRef;
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
