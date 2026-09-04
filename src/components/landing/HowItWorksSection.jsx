import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, ShieldCheck, ArrowLeftRight, PackageSearch } from "lucide-react";
import { useScrollReveal } from "../../lib/useScrollReveal.js";
import "./HowItWorksSection.css";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create account",
    description:
      "Register with your details and identity photo in minutes — no branch visit required.",
  },
  {
    icon: ShieldCheck,
    title: "Complete verification",
    description:
      "Confirm your identity and account details so your profile is fully verified and secured.",
  },
  {
    icon: ArrowLeftRight,
    title: "Transfer money",
    description:
      "Move funds between accounts with authorization checks and full transaction history.",
  },
  {
    icon: PackageSearch,
    title: "Track banking requests",
    description:
      "Follow every cheque book order, return request, or dispatch with live status tracking.",
  },
];

export default function HowItWorksSection() {
  const containerRef = useScrollReveal();
  const timelineRef = useRef(null);

  // Progress line fills as the timeline itself scrolls through the
  // viewport — not a generic page-scroll bar, scoped to this section only.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 55%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="landing__section how-it-works" id="how-it-works" ref={containerRef}>
      <div className="landing__container">
        <div className="landing__section-head landing__section-head--center" data-reveal>
          <span className="landing__eyebrow" style={{ justifyContent: "center" }}>
            How it works
          </span>
          <h2 className="landing__heading landing__heading--lg">
            From sign-up to your first transfer
          </h2>
        </div>

        <div className="how-it-works__timeline" data-reveal-group ref={timelineRef}>
          <div className="how-it-works__line" aria-hidden="true">
            <motion.div
              className="how-it-works__line-fill"
              style={{ scaleX: lineScale, scaleY: lineScale }}
            />
          </div>
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                className="how-it-works__step"
                key={step.title}
                data-reveal
                whileHover="hover"
                initial="rest"
              >
                <div className="how-it-works__marker">
                  <span className="how-it-works__marker-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    className="how-it-works__marker-icon"
                    variants={{
                      rest: { scale: 1, borderColor: "var(--color-border-strong)" },
                      hover: { scale: 1.08, borderColor: "var(--color-primary)" },
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </motion.span>
                </div>
                <div className="how-it-works__content">
                  <h3 className="how-it-works__title">{step.title}</h3>
                  <p className="how-it-works__description">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
