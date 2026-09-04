import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import "./AiFormAssistantCard.css";

/**
 * AI Form Assistant entry. Dashboard page card was moved into the sidebar
 * so the assistant lives in the persistent chrome, not the scrolling pane.
 * `variant="sidebar"` is the production entry; `variant="card"` remains
 * for any one-off surfaces that still need the original card layout.
 */
export default function AiFormAssistantCard({ variant = "card", onNavigate }) {
  const navigate = useNavigate();

  if (variant === "sidebar") {
    return (
      <NavLink
        to="/ai-form-assistant"
        onClick={onNavigate}
        className={({ isActive }) =>
          `sidebar-ai${isActive ? " sidebar-ai--active" : ""}`
        }
        aria-label="Open AI Form Assistant"
      >
        <span className="sidebar-ai__icon" aria-hidden="true">
          <Sparkles size={16} strokeWidth={2.25} />
        </span>
        <span className="sidebar-ai__copy">
          <span className="sidebar-ai__title">AI Form Assistant</span>
          <span className="sidebar-ai__hint">Start a request</span>
        </span>
        <ArrowRight className="sidebar-ai__arrow" size={14} aria-hidden="true" />
      </NavLink>
    );
  }

  return (
    <Card hoverable className="ai-assistant-entry-card" onClick={() => navigate("/ai-form-assistant")}>
      <CardHeader
        title="AI Form Assistant"
        action={
          <span className="ai-assistant-entry-card__badge">
            <Sparkles size={14} />
          </span>
        }
      />
      <p className="text-muted ai-assistant-entry-card__description">
        Tell the assistant what you need — like opening an account — and it'll guide you
        through the paperwork.
      </p>
      <motion.span
        className="ai-assistant-entry-card__cta"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        Start a request <ArrowRight size={14} />
      </motion.span>
    </Card>
  );
}
