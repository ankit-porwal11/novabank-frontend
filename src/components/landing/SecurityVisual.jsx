import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import "./SecurityVisual.css";

/**
 * Purely illustrative — represents "encrypted, monitored session" visually
 * without claiming any specific third-party certification NovaBank hasn't
 * actually obtained (no fabricated "SOC 2" / "PCI-DSS" badges).
 */
export default function SecurityVisual({ align = "center" }) {
  return (
    <div
      className="security-visual"
      style={align === "left" ? { margin: "0 0 var(--space-8) 0" } : undefined}
      aria-hidden="true"
    >
      <motion.span
        className="security-visual__ring security-visual__ring--1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="security-visual__ring security-visual__ring--2"
        animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.08, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <div className="security-visual__core">
        <ShieldCheck size={30} strokeWidth={2} />
      </div>

      {/* Orbiting encrypted-packet dots */}
      <motion.div
        className="security-visual__orbit"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <span className="security-visual__packet" />
      </motion.div>
      <motion.div
        className="security-visual__orbit security-visual__orbit--reverse"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <span className="security-visual__packet security-visual__packet--accent" />
      </motion.div>
    </div>
  );
}
