import { motion } from "framer-motion";

/**
 * Uniform enter/exit treatment for every route. Deliberately subtle —
 * a premium product transitions between screens, it doesn't perform.
 * Wrapping only; never touches the page's own data/auth logic.
 */
const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}
