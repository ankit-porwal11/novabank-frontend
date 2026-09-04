import { motion } from "framer-motion";

/**
 * Generic stagger primitives for entrance animation — used by dashboard,
 * profile, and settings pages so "cards stagger in" is one shared pattern
 * instead of bespoke keyframes per page.
 */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerGroup({ children, className = "", as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} variants={staggerContainer} initial="hidden" animate="show">
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
