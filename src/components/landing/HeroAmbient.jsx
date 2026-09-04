import { motion } from "framer-motion";
import "./HeroAmbient.css";

/**
 * The back-most parallax layer: soft drifting glow and faint light rays.
 * Kept restrained — two colors from the brand palette, low opacity, slow
 * motion. This is what reads as "premium atmosphere" rather than "scene".
 */
export default function HeroAmbient({ parallaxX, parallaxY }) {
  return (
    <motion.div
      className="hero-ambient"
      aria-hidden="true"
      style={{ x: parallaxX, y: parallaxY }}
    >
      <motion.span
        className="hero-ambient__blob hero-ambient__blob--primary"
        animate={{ x: [0, 24, 0], y: [0, -16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="hero-ambient__blob hero-ambient__blob--accent"
        animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <span className="hero-ambient__ray hero-ambient__ray--1" />
      <span className="hero-ambient__ray hero-ambient__ray--2" />
      <span className="hero-ambient__grid" />
    </motion.div>
  );
}
