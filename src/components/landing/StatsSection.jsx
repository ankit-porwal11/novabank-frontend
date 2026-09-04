import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Activity } from "lucide-react";
import { gsap, ScrollTrigger, MOTION } from "../../lib/motion.js";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import "./StatsSection.css";

const STATS = [
  {
    icon: ShieldCheck,
    value: 99.98,
    suffix: "%",
    decimals: 2,
    label: "Platform uptime",
  },
  {
    icon: Zap,
    value: 2,
    prefix: "<",
    suffix: "s",
    decimals: 0,
    label: "Avg. transfer confirmation",
  },
  {
    icon: Lock,
    value: 256,
    suffix: "-bit",
    decimals: 0,
    label: "Session encryption",
  },
  {
    icon: Activity,
    value: 24,
    suffix: "/7",
    decimals: 0,
    label: "Account monitoring",
  },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const counters = section.querySelectorAll("[data-stat-value]");

    if (prefersReducedMotion) {
      counters.forEach((el) => {
        el.textContent = el.dataset.finalLabel;
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.statValue);
        const decimals = parseInt(el.dataset.decimals, 10) || 0;
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: MOTION.duration.slow,
          ease: MOTION.easeInOut,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`;
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="landing__section stats-section" ref={sectionRef}>
      <div className="stats-section__ambient" aria-hidden="true" />
      <div className="landing__container">
        <div className="stats-grid">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                className="stats-card"
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="stats-card__icon">
                  <Icon size={16} strokeWidth={2.25} />
                </span>
                <p
                  className="stats-card__value"
                  data-stat-value={stat.value}
                  data-decimals={stat.decimals}
                  data-prefix={stat.prefix || ""}
                  data-suffix={stat.suffix || ""}
                  data-final-label={`${stat.prefix || ""}${stat.value}${stat.suffix || ""}`}
                >
                  {`${stat.prefix || ""}0${stat.suffix || ""}`}
                </p>
                <p className="stats-card__label">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
