import { motion } from "framer-motion";
import { ArrowLeftRight, ShieldCheck, CheckCircle2, Clock3 } from "lucide-react";
import "./FloatingIndicators.css";

const INDICATORS = [
  {
    icon: ArrowLeftRight,
    label: "Transfer complete",
    sub: "$2,400.00",
    className: "floating-indicator--1",
    float: { y: [0, -14, 0], duration: 6.5 },
  },
  {
    icon: ShieldCheck,
    label: "Identity verified",
    sub: null,
    className: "floating-indicator--2",
    float: { y: [0, 12, 0], duration: 5.5 },
  },
  {
    icon: CheckCircle2,
    label: "Payment approved",
    sub: null,
    className: "floating-indicator--3",
    float: { y: [0, -10, 0], duration: 7 },
  },
  {
    icon: Clock3,
    label: "Processing",
    sub: "0.8s avg.",
    className: "floating-indicator--4",
    float: { y: [0, 10, 0], duration: 6 },
  },
];

/**
 * DOM-based (not WebGL) so labels stay crisp at any DPR and the layer can
 * carry its own parallax intensity independent of the 3D card. This is the
 * "premium fintech dashboard glimpse" layer — never more than 4 chips, all
 * referencing real product actions (transfer, verification, approval),
 * nothing crypto/gamified.
 */
export default function FloatingIndicators({ parallaxX, parallaxY }) {
  return (
    <div className="floating-indicators" aria-hidden="true">
      {INDICATORS.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            className={`floating-indicator ${item.className}`}
            style={{ x: parallaxX, y: parallaxY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="floating-indicator__inner"
              animate={{ y: item.float.y }}
              transition={{
                duration: item.float.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              <span className="floating-indicator__icon">
                <Icon size={14} strokeWidth={2.25} />
              </span>
              <span className="floating-indicator__text">
                <span className="floating-indicator__label">{item.label}</span>
                {item.sub && <span className="floating-indicator__sub">{item.sub}</span>}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
