import { useNavigate } from "react-router-dom";
import { KeyRound, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Card, { CardHeader } from "../ui/Card.jsx";
import "./SecuritySettingsCard.css";

export default function SecuritySettingsCard() {
  const navigate = useNavigate();

  return (
    <Card className="security-settings-card">
      <div className="security-settings-card__glow" aria-hidden="true" />
      <CardHeader title="Security" subtitle="Manage how you sign in to NovaBank" />
      <motion.button
        type="button"
        onClick={() => navigate("/settings/security")}
        className="security-settings-card__row"
        whileHover={{ borderColor: "var(--color-primary)", x: 2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18 }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <motion.span
            className="security-settings-card__icon"
            whileHover={{ rotate: -6, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
          >
            <KeyRound size={16} />
          </motion.span>
          <span style={{ textAlign: "left" }}>
            <span style={{ display: "block", fontSize: "var(--fs-sm)", fontWeight: 700 }}>
              Change password
            </span>
            <span
              style={{
                display: "block",
                fontSize: "var(--fs-xs)",
                color: "var(--color-text-faint)",
              }}
            >
              Update your account password
            </span>
          </span>
        </span>
        <ChevronRight size={16} color="var(--color-text-faint)" />
      </motion.button>

      <div className="security-settings-card__footer">
        <ShieldCheck size={13} strokeWidth={2.25} />
        <span>Protected by rate-limited, JWT-secured authentication</span>
      </div>
    </Card>
  );
}
