import { motion } from "framer-motion";

/**
 * Lightweight animated illustration for the Login/Register side panel.
 * Deliberately NOT three.js — the 3D bundle must load only on the landing
 * page. This is pure SVG + framer-motion, cheap enough to ship on every
 * auth page load.
 */
export default function AuthIllustration() {
  return (
    <div className="auth-illustration" aria-hidden="true">
      <motion.div
        className="auth-illustration__card"
        initial={{ opacity: 0, y: 20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
            <defs>
              <linearGradient id="illo-card" x1="0" y1="0" x2="220" y2="140">
                <stop offset="0" stopColor="#1d2b52" />
                <stop offset="1" stopColor="#12213a" />
              </linearGradient>
            </defs>
            <rect width="220" height="140" rx="16" fill="url(#illo-card)" />
            <rect x="24" y="30" width="34" height="24" rx="4" fill="rgba(248,250,252,0.8)" />
            <rect x="24" y="92" width="120" height="10" rx="3" fill="rgba(248,250,252,0.35)" />
            <rect x="24" y="70" width="80" height="8" rx="3" fill="rgba(248,250,252,0.2)" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        className="auth-illustration__chip auth-illustration__chip--1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 0.3, duration: 0.5 },
          scale: { delay: 0.3, duration: 0.5 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
      >
        <ShieldGlyph />
      </motion.div>

      <motion.div
        className="auth-illustration__chip auth-illustration__chip--2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 0.45, duration: 0.5 },
          scale: { delay: 0.45, duration: 0.5 },
          y: { duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
        }}
      >
        <CheckGlyph />
      </motion.div>

      <div className="auth-illustration__rings">
        <span className="auth-illustration__ring auth-illustration__ring--1" />
        <span className="auth-illustration__ring auth-illustration__ring--2" />
      </div>
    </div>
  );
}

function ShieldGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 4 5v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V5l-8-3z"
        fill="rgba(6, 182, 212, 0.18)"
        stroke="#06b6d4"
        strokeWidth="1.4"
      />
      <path
        d="M8.5 12l2.4 2.4L15.8 9"
        stroke="#06b6d4"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(37, 99, 235, 0.18)" stroke="#2563eb" strokeWidth="1.4" />
      <path
        d="M7.5 12.5 10.3 15.3 16.5 9"
        stroke="#2563eb"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
