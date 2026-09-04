import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCog, ImagePlus, KeyRound, Settings2 } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import MagneticButton from "../motion/MagneticButton.jsx";
import "./QuickActionsGrid.css";

const ACTIONS = [
  {
    icon: UserCog,
    label: "Update details",
    description: "Edit your name and email",
    to: "/profile",
  },
  {
    icon: ImagePlus,
    label: "Update photos",
    description: "Change avatar or cover image",
    to: "/profile",
  },
  {
    icon: KeyRound,
    label: "Change password",
    description: "Rotate your account password",
    to: "/settings/security",
  },
  {
    icon: Settings2,
    label: "Account settings",
    description: "Manage session and preferences",
    to: "/settings",
  },
];

export default function QuickActionsGrid() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader title="Quick actions" />
      <div className="quick-actions">
        {ACTIONS.map(({ icon: Icon, label, description, to }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton strength={5} fullWidth>
              <motion.button
                type="button"
                className="quick-actions__item"
                onClick={() => navigate(to)}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="quick-actions__sweep"
                  variants={{ hover: { x: ["-120%", "160%"], transition: { duration: 0.7 } } }}
                  aria-hidden="true"
                />
                <motion.span
                  className="quick-actions__icon"
                  variants={{ hover: { scale: 1.12, rotate: -4 } }}
                  transition={{ type: "spring", stiffness: 380, damping: 16 }}
                >
                  <Icon size={18} strokeWidth={2} />
                </motion.span>
                <span className="quick-actions__text">
                  <span className="quick-actions__label">{label}</span>
                  <span className="quick-actions__description">{description}</span>
                </span>
              </motion.button>
            </MagneticButton>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
