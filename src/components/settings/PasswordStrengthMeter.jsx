import { motion } from "framer-motion";

/**
 * Visual-only strength indicator. This never changes what the backend
 * accepts (8-char minimum, enforced in lib/validators.js and the backend
 * controller) — it's feedback to help users choose a stronger password,
 * not a gate.
 */
function scorePassword(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const LEVELS = [
  { label: "Too short", color: "var(--color-danger)" },
  { label: "Weak", color: "var(--color-danger)" },
  { label: "Fair", color: "var(--color-warning)" },
  { label: "Good", color: "var(--color-accent)" },
  { label: "Strong", color: "var(--color-success)" },
];

export default function PasswordStrengthMeter({ password }) {
  const score = scorePassword(password);
  const level = LEVELS[score];

  if (!password) return null;

  return (
    <div style={{ marginTop: -8 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: "var(--color-border)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < score ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                height: "100%",
                background: level.color,
                transformOrigin: "left",
              }}
            />
          </div>
        ))}
      </div>
      <motion.p
        key={level.label}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: "var(--fs-xs)",
          color: level.color,
          marginTop: 6,
          fontWeight: 600,
        }}
      >
        {level.label}
      </motion.p>
    </div>
  );
}
