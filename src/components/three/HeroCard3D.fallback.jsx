import "./HeroCard3D.fallback.css";

/**
 * Pure CSS/SVG stand-in for the 3D hero card. Used when:
 * - prefers-reduced-motion is set
 * - WebGL context creation fails
 * - viewport is below the mobile 3D threshold (see HeroSection.jsx)
 * Visually consistent with the 3D version's card face so there's no jarring
 * swap between the two.
 */
export default function HeroCard3DFallback() {
  return (
    <div className="hero-card-fallback" aria-hidden="true">
      <div className="hero-card-fallback__card">
        <div className="hero-card-fallback__sweep" />
        <div className="hero-card-fallback__chip" />
        <p className="hero-card-fallback__number">•••• •••• •••• 4821</p>
        <p className="hero-card-fallback__brand">NovaBank</p>
        <p className="hero-card-fallback__tier">PREMIUM</p>
      </div>
    </div>
  );
}
