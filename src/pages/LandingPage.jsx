import Navbar from "../components/landing/Navbar.jsx";
import HeroSection from "../components/landing/HeroSection.jsx";
import TrustMarquee from "../components/landing/TrustMarquee.jsx";
import HowItWorksSection from "../components/landing/HowItWorksSection.jsx";
import FeatureSection from "../components/landing/FeatureSection.jsx";
import StatsSection from "../components/landing/StatsSection.jsx";
import SecuritySection from "../components/landing/SecuritySection.jsx";
import CtaSection from "../components/landing/CtaSection.jsx";
import Footer from "../components/landing/Footer.jsx";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing__grain" aria-hidden="true" />
      <Navbar />
      <main>
        <HeroSection />
        <TrustMarquee />
        <HowItWorksSection />
        <FeatureSection />
        <StatsSection />
        <SecuritySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
