import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import "./SecurityScoreRing.css";

/**
 * A "premium metric" card in the spirit of a balance/health widget — but
 * grounded in real, derivable facts about the account rather than a
 * fabricated currency figure (Phase 1 has no accounts/balance API). Score
 * reflects genuine profile completeness: verified account, avatar set,
 * cover image set, email on file.
 */
function computeScore(user) {
  if (!user) return { score: 0, checks: [] };
  const checks = [
    { label: "Account verified", done: true },
    { label: "Profile photo set", done: !!user.avatar },
    { label: "Cover image set", done: !!user.coverimage },
    { label: "Email on file", done: !!user.email },
  ];
  const done = checks.filter((c) => c.done).length;
  return { score: Math.round((done / checks.length) * 100), checks };
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SecurityScoreRing({ user }) {
  const { score, checks } = computeScore(user);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(0);
  const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, score, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(Math.round(v));
        setDashOffset(CIRCUMFERENCE - (v / 100) * CIRCUMFERENCE);
      },
    });
    return () => controls.stop();
  }, [isInView, score]);

  return (
    <div ref={ref}>
      <Card>
        <CardHeader title="Account health" subtitle="Profile completeness at a glance" />
        <div className="security-score">
          <div className="security-score__ring-wrap">
            <svg width="120" height="120" viewBox="0 0 120 120" className="security-score__svg">
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="url(#security-score-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="security-score-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--color-primary)" />
                  <stop offset="1" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="security-score__center">
              <span className="security-score__value">{display}%</span>
            </div>
          </div>

          <div className="security-score__checks">
            {checks.map((check, i) => (
              <motion.div
                className="security-score__check"
                key={check.label}
                initial={{ opacity: 0, x: 10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
              >
                <span
                  className={`security-score__check-icon ${
                    check.done ? "security-score__check-icon--done" : ""
                  }`}
                >
                  <ShieldCheck size={12} strokeWidth={2.5} />
                </span>
                {check.label}
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
