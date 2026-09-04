import { motion } from "framer-motion";

/**
 * Small animated checkmark used after successful mutations (avatar/cover
 * upload, password change) — draws itself in rather than just appearing,
 * consistent "success" language across the app.
 */
export default function SuccessCheck({ size = 22 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill="var(--color-success-soft)"
        stroke="var(--color-success)"
        strokeWidth="1.5"
      />
      <motion.path
        d="M7.5 12.5L10.3 15.3L16.5 9"
        stroke="var(--color-success)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
