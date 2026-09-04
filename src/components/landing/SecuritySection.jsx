import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, Fingerprint, Server, Lock, Eye, Activity } from "lucide-react";
import { useScrollReveal } from "../../lib/useScrollReveal.js";
import TiltCard from "../motion/TiltCard.jsx";
import SecurityVisual from "./SecurityVisual.jsx";
import "./SecuritySection.css";

const POINTS = [
  {
    icon: KeyRound,
    title: "httpOnly, encrypted sessions",
    description:
      "Access and refresh tokens never touch client-side storage — cookies are encrypted and inaccessible to scripts.",
  },
  {
    icon: Fingerprint,
    title: "Verified identity onboarding",
    description:
      "Every account is created with identity verification before it's activated for transfers.",
  },
  {
    icon: Server,
    title: "Rate-limited authentication",
    description:
      "Login attempts are rate-limited to protect your account against automated attacks.",
  },
];

const TRUST_BADGES = [
  { icon: Lock, label: "Encrypted sessions" },
  { icon: Eye, label: "Verified onboarding" },
  { icon: Activity, label: "Rate-limited access" },
];

export default function SecuritySection() {
  const containerRef = useScrollReveal();

  return (
    <section className="landing__section security-section" id="security" ref={containerRef}>
      <div className="landing__container security-section__inner">
        <div className="security-section__copy" data-reveal>
          <SecurityVisual align="left" />
          <span className="landing__eyebrow">
            <ShieldCheck size={13} strokeWidth={2.5} />
            Security
          </span>
          <h2 className="landing__heading landing__heading--lg">
            Built to be trusted with the details that matter
          </h2>
          <p className="landing__subhead" style={{ marginTop: "16px" }}>
            The same session security that protects your dashboard protects
            every page on NovaBank — nothing about how your data is handled
            changes once you sign in.
          </p>

          <div className="security-section__badges">
            {TRUST_BADGES.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <span className="security-section__badge" key={badge.label}>
                  <BadgeIcon size={13} strokeWidth={2.25} />
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>

        <TiltCard maxTilt={3} className="security-section__points landing__glass-card">
          <div data-reveal-group style={{ display: "contents" }}>
            {POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  className="security-point"
                  key={point.title}
                  data-reveal
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="security-point__icon">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="security-point__title">{point.title}</h3>
                    <p className="security-point__description">{point.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
