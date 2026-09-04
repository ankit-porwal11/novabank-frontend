import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTransform } from "framer-motion";
import HeroVisual from "./HeroVisual.jsx";
import HeroAmbient from "./HeroAmbient.jsx";
import FloatingIndicators from "./FloatingIndicators.jsx";
import Button from "../ui/Button.jsx";
import MagneticButton from "../motion/MagneticButton.jsx";
import { gsap, MOTION } from "../../lib/motion.js";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import { useMouseParallax } from "../../lib/useMouseParallax.js";
import "./HeroSection.css";

export default function HeroSection() {
  const navigate = useNavigate();
  const textRef = useRef(null);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { x, y } = useMouseParallax(sectionRef);
  // Layered parallax: background glow drifts least, floating chips drift
  // most — the 3D card itself reacts to mouse independently inside the
  // canvas (see HeroCard3D), giving three distinct depth planes.
  const ambientX = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const ambientY = useTransform(y, [-0.5, 0.5], [-8, 8]);
  const indicatorX = useTransform(x, [-0.5, 0.5], [-22, 22]);
  const indicatorY = useTransform(y, [-0.5, 0.5], [-18, 18]);

  useEffect(() => {
    if (prefersReducedMotion || !textRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        opacity: 0,
        y: 24,
        duration: MOTION.duration.slow,
        ease: MOTION.ease,
        stagger: MOTION.stagger,
        delay: 0.1,
      });
    }, textRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="hero" ref={(node) => { textRef.current = node; sectionRef.current = node; }}>
      <HeroAmbient parallaxX={ambientX} parallaxY={ambientY} />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner landing__container">
        <div className="hero__copy">
          <span className="landing__eyebrow" data-hero-reveal>
            <ShieldCheck size={13} strokeWidth={2.5} />
            Bank-grade security by default
          </span>
          <h1 className="landing__heading landing__heading--xl" data-hero-reveal>
            Banking that feels
            <br />
            as solid as it is.
          </h1>
          <p className="landing__subhead hero__subhead" data-hero-reveal>
            NovaBank brings enterprise-grade infrastructure to everyday
            banking — encrypted by default, built for clarity, and designed
            to be trusted with the things that matter.
          </p>
          <div className="hero__actions" data-hero-reveal>
            <MagneticButton strength={12}>
              <Button size="lg" onClick={() => navigate("/register")}>
                Open an account
                <ArrowRight size={16} style={{ marginLeft: 4 }} />
              </Button>
            </MagneticButton>
            <MagneticButton strength={10}>
              <Button variant="secondary" size="lg" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </MagneticButton>
          </div>
        </div>

        <div className="hero__visual" data-hero-reveal>
          <FloatingIndicators parallaxX={indicatorX} parallaxY={indicatorY} />
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
