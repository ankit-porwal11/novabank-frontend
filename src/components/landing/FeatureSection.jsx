import { motion } from "framer-motion";
import {
  Landmark,
  ArrowLeftRight,
  Undo2,
  BookMarked,
  Radar,
  Sparkles,
  ScanText,
  FileOutput,
} from "lucide-react";
import { useScrollReveal } from "../../lib/useScrollReveal.js";
import TiltCard from "../motion/TiltCard.jsx";
import "./FeatureSection.css";

/**
 * Every card here maps to a real module in Backend/src — not generic
 * fintech marketing copy. Cross-referenced against:
 * account.controller.js, transfer.controller.js, returnRequest.controller.js,
 * bankingOrder.controller.js (CHEQUE_BOOK), courier.service.js (tracking),
 * and ai/ (form template journeys, OCR, PDF generation).
 */
const FEATURES = [
  {
    icon: Landmark,
    title: "Banking accounts",
    description:
      "Open and manage core banking accounts with balances, statements, and account-level controls.",
    accent: "primary",
  },
  {
    icon: ArrowLeftRight,
    title: "Money transfers",
    description:
      "Send funds between accounts with authorization checks and a full transaction record.",
    accent: "accent",
  },
  {
    icon: Undo2,
    title: "Return requests",
    description:
      "Raise and track return requests on banking orders, with status updates at every stage.",
    accent: "primary",
  },
  {
    icon: BookMarked,
    title: "Cheque book orders",
    description:
      "Order cheque books, debit cards, and passbooks directly from your account.",
    accent: "accent",
  },
  {
    icon: Radar,
    title: "Order tracking",
    description:
      "Follow courier-assigned tracking for every dispatched order from request to delivery.",
    accent: "primary",
  },
  {
    icon: Sparkles,
    title: "AI form assistant",
    description:
      "Complete banking forms conversationally — the assistant guides you field by field.",
    accent: "accent",
  },
  {
    icon: ScanText,
    title: "OCR document processing",
    description:
      "Upload identity or supporting documents and let OCR extract the details automatically.",
    accent: "primary",
  },
  {
    icon: FileOutput,
    title: "PDF generation",
    description:
      "Get completed forms and statements generated as ready-to-download PDFs.",
    accent: "accent",
  },
];

export default function FeatureSection() {
  const containerRef = useScrollReveal();

  return (
    <section className="landing__section feature-section" id="features" ref={containerRef}>
      <div className="landing__container">
        <div className="landing__section-head" data-reveal>
          <span className="landing__eyebrow">Platform</span>
          <h2 className="landing__heading landing__heading--lg">
            Everything your account needs, built in
          </h2>
          <p className="landing__subhead" style={{ marginTop: "12px" }}>
            No bolted-on integrations — every module below runs on NovaBank's
            own banking infrastructure.
          </p>
        </div>

        <div className="feature-grid" data-reveal-group>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} data-reveal>
                <TiltCard maxTilt={5} className={`feature-card feature-card--${feature.accent}`}>
                  <span className="feature-card__gradient" aria-hidden="true" />
                  <motion.span
                    className="feature-card__icon"
                    initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    whileHover={{ scale: 1.1, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 320, damping: 16 }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </motion.span>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__description">{feature.description}</p>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
