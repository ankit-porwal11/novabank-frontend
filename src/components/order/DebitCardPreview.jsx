import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark, Wifi } from "lucide-react";
import "./DebitCardPreview.css";

/**
 * "Premium 360 Degree Rotating Debit Card" per spec — a genuine two-sided
 * flip (front/back are different faces, not the same content spinning
 * through itself like the account BankCard). Reuses the same navy/gold
 * gradient tokens (--account-navy, --account-navy-deep, --account-blue-mid,
 * --account-gold, defined in account.css) for visual consistency with the
 * rest of the banking card system. This card previews the product — it
 * isn't tied to the user's real account, so "NovaBank / Debit Card" is
 * static branding text, not fabricated account data.
 */
export default function DebitCardPreview() {
  const navigate = useNavigate();

  return (
    <div className="debit-preview-stage">
      <motion.div
        className="debit-preview"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ rotateY: 360 }}
        transition={{
          opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          rotateY: { duration: 1.4, ease: [0.65, 0, 0.35, 1] },
        }}
        onClick={() => navigate("/orders/card/request")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate("/orders/card/request");
        }}
      >
        <span className="debit-preview__ambient" aria-hidden="true" />

        {/* Front */}
        <div className="debit-preview__face debit-preview__face--front">
          <span className="debit-preview__wave" aria-hidden="true" />
          <div className="debit-preview__top">
            <span className="debit-preview__brand-mark">
              <Landmark size={20} strokeWidth={2.25} />
            </span>
            <Wifi size={18} strokeWidth={2} className="debit-preview__contactless" />
          </div>
          <div className="debit-preview__chip" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="debit-preview__bottom">
            <p className="debit-preview__brand-name">NovaBank</p>
            <p className="debit-preview__tag">Debit Card</p>
          </div>
        </div>

        {/* Back */}
        <div className="debit-preview__face debit-preview__face--back">
          <span className="debit-preview__stripe" aria-hidden="true" />
          <p className="debit-preview__back-text">NovaBank Debit Card</p>
        </div>
      </motion.div>

      <p className="debit-preview__hint">Tap the card to request your NovaBank Debit Card</p>
    </div>
  );
}
