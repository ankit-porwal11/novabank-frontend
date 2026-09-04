import { motion } from "framer-motion";
import { ShieldCheck, Landmark } from "lucide-react";
import "./FloatingAccountCard.css";

function maskAccountId(id) {
  if (!id) return "•••• •••• •••• ••••";
  const tail = id.slice(-4);
  return `•••• •••• •••• ${tail}`;
}

export default function FloatingAccountCard({ user }) {
  return (
    <motion.div
      className="floating-account-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Breathing ambient glow — idle motion, not tied to hover */}
      <motion.span
        className="floating-account-card__glow"
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Separate hover-boost layer — kept apart from the idle breathing
          span above since mixing a local `animate` loop with inherited
          hover variants on the same element causes them to fight. */}
      <motion.span
        className="floating-account-card__glow floating-account-card__glow--hover"
        variants={{ hover: { opacity: 1 } }}
        aria-hidden="true"
      />

      {/* Glass reflection sweep on hover */}
      <motion.span
        className="floating-account-card__sweep"
        variants={{
          hover: { x: ["-120%", "160%"], transition: { duration: 0.9, ease: "easeInOut" } },
        }}
        aria-hidden="true"
      />

      <div className="floating-account-card__top">
        <span className="floating-account-card__mark">
          <Landmark size={18} strokeWidth={2.25} />
        </span>
        <span className="floating-account-card__live">
          <span className="floating-account-card__live-dot" />
          Session active
        </span>
      </div>

      <p className="floating-account-card__id text-mono">
        {maskAccountId(user?._id)}
      </p>

      <div className="floating-account-card__bottom">
        <div>
          <p className="floating-account-card__label">Account holder</p>
          <p className="floating-account-card__name">{user?.fullName || user?.username}</p>
        </div>
        <span className="floating-account-card__badge">
          <ShieldCheck size={12} strokeWidth={2.5} />
          Verified
        </span>
      </div>
    </motion.div>
  );
}
