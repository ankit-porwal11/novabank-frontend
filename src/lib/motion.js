import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, lazily, only when a landing-page module imports this file.
// Nothing in the dashboard/auth bundle touches gsap at all.
gsap.registerPlugin(ScrollTrigger);

/**
 * Shared timing/easing so every section of the landing page feels like one
 * coherent motion language instead of a patchwork of ad-hoc animations.
 */
export const MOTION = {
  ease: "power3.out",
  easeInOut: "power2.inOut",
  duration: {
    fast: 0.4,
    base: 0.7,
    slow: 1.1,
  },
  stagger: 0.09,
};

export { gsap, ScrollTrigger };
