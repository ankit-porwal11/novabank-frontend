import { motion } from "framer-motion";
import { Lock, LockKeyhole } from "lucide-react";

export default function SecureLockAnimation({ locked = false }) {
  return (
    <motion.div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: "var(--radius-full)",
        background: locked ? "var(--color-success-soft)" : "var(--color-primary-soft)",
        color: locked ? "var(--color-success)" : "#93c5fd",
      }}
      animate={locked ? { scale: [1, 1.15, 1] } : { rotate: [0, -4, 4, 0] }}
      transition={
        locked
          ? { duration: 0.5, ease: "easeOut" }
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {locked ? <LockKeyhole size={22} strokeWidth={2} /> : <Lock size={20} strokeWidth={2} />}
    </motion.div>
  );
}
