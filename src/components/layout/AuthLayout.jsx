import { motion } from "framer-motion";
import { Landmark, ShieldCheck } from "lucide-react";
import AuthIllustration from "./AuthIllustration.jsx";
import "./AuthLayout.css";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <div className="auth-layout__ambient" aria-hidden="true">
          <span className="auth-layout__ray auth-layout__ray--1" />
          <span className="auth-layout__ray auth-layout__ray--2" />
          <span className="auth-layout__particles" />
        </div>

        <motion.div
          className="auth-layout__brand"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="auth-layout__brand-mark">
            <Landmark size={22} strokeWidth={2.25} />
          </span>
          <span className="auth-layout__brand-name">NovaBank</span>
        </motion.div>

        <motion.h2
          className="auth-layout__headline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Banking built on trust,
          <br />
          engineered for clarity.
        </motion.h2>
        <motion.p
          className="auth-layout__copy"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Manage your account, monitor your profile, and keep your credentials
          secure — all from one calm, dependable place.
        </motion.p>

        <motion.div
          className="auth-layout__badge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShieldCheck size={16} strokeWidth={2.25} />
          <span>Session secured with httpOnly, encrypted cookies</span>
        </motion.div>

        <AuthIllustration />
      </div>

      <div className="auth-layout__form-side">
        <motion.div
          className="auth-layout__card glass-panel"
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-layout__card-header">
            <h1 className="auth-layout__title">{title}</h1>
            {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
