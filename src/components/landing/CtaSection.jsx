import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../../lib/useScrollReveal.js";
import Button from "../ui/Button.jsx";
import "./CtaSection.css";

export default function CtaSection() {
  const navigate = useNavigate();
  const containerRef = useScrollReveal();

  return (
    <section className="landing__section cta-section" ref={containerRef}>
      <div className="landing__container">
        <div className="cta-card" data-reveal>
          <div className="cta-card__glow" aria-hidden="true" />
          <h2 className="landing__heading landing__heading--lg cta-card__title">
            Open your NovaBank account today
          </h2>
          <p className="landing__subhead cta-card__subhead">
            Set up secure access in minutes and start managing your account
            with the same infrastructure enterprise banks trust.
          </p>
          <Button size="lg" onClick={() => navigate("/register")}>
            Open an account
            <ArrowRight size={16} style={{ marginLeft: 4 }} />
          </Button>
        </div>
      </div>
    </section>
  );
}
