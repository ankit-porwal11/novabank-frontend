import { useEffect } from "react";
import { motion } from "framer-motion";
import { Landmark, Wifi } from "lucide-react";
import "./BankCard.css";

function formatAccountNumber(accountNumber) {
  if (!accountNumber) return "•••• •••• ••";
  const groups = String(accountNumber).match(/.{1,4}/g) || [accountNumber];
  return groups.join("  ");
}

function titleCase(value) {
  if (!value) return "—";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

/**
 * BankCard — the one premium banking card used across the whole Account
 * module (Overview hero, Details/Transactions header anchor, and any
 * future Transfer/Return Requests page). All displayed values come from
 * the /account/details response — nothing here is hardcoded or estimated.
 *
 * size="lg" — Overview's hero centerpiece.
 * size="sm" — a properly-proportioned realistic card (not a stretched
 *             banner) used to anchor Details/Transactions.
 *
 * Interaction: a genuine full 360° rotateY spin on hover — not a
 * mouse-tracked micro-tilt. Framer Motion drives it as a single gesture
 * variant, so it's GPU-composited (transform only) and stays smooth.
 */
export default function BankCard({ account, holderName, size = "lg" }) {
  // TEMP DEBUG — remove once navigation is confirmed fixed in-browser.
  useEffect(() => {
    console.log(`[BankCard] MOUNT size="${size}" account=${account?.accountNumber || "none"}`);
    return () => console.log(`[BankCard] UNMOUNT size="${size}"`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`bank-card-stage ${size === "sm" ? "bank-card-stage--sm" : ""}`}>
      <motion.div
        className="bank-card"
        initial={{ opacity: 0, y: 18, rotateY: 0 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        whileHover={{ rotateY: 360 }}
        transition={{
          opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          rotateY: { duration: 1.3, ease: [0.65, 0, 0.35, 1] },
        }}
      >
        {/* Ambient glow beneath the card */}
        <span className="bank-card__ambient" aria-hidden="true" />

        <div className="bank-card__surface">
          {/* Wavy metallic sheen — layered gradients, no image asset */}
          <span className="bank-card__wave bank-card__wave--1" aria-hidden="true" />
          <span className="bank-card__wave bank-card__wave--2" aria-hidden="true" />
          <span className="bank-card__sheen" aria-hidden="true" />

          <div className="bank-card__top">
            <div className="bank-card__brand">
              <span className="bank-card__brand-mark">
                <Landmark size={size === "sm" ? 15 : 19} strokeWidth={2.3} />
              </span>
              <p className="bank-card__brand-name">NovaBank</p>
            </div>
            <span className="bank-card__debit-tag">Debit</span>
          </div>

          <div className="bank-card__chip-row">
            <div className="bank-card__chip" aria-hidden="true">
              <span className="bank-card__chip-line" />
              <span className="bank-card__chip-line" />
              <span className="bank-card__chip-line" />
            </div>
            <Wifi size={size === "sm" ? 15 : 18} strokeWidth={2} className="bank-card__contactless" />
          </div>

          <p className="bank-card__number text-mono">
            {formatAccountNumber(account?.accountNumber)}
          </p>

          <div className="bank-card__bottom">
            <div>
              <p className="bank-card__label">Card holder</p>
              <p className="bank-card__holder">{holderName || "—"}</p>
            </div>
            <div className="bank-card__right">
              <p className="bank-card__label">{account?.accountType ? "Account type" : "Currency"}</p>
              <p className="bank-card__holder">
                {account?.accountType ? titleCase(account.accountType) : account?.currency || "—"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
