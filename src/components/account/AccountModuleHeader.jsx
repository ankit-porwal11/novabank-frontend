import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import "../../styles/account.css";

/**
 * Tab set for the Account module. Overview / Details / Transactions
 * (Phase 2.1) plus Transfer / Return Requests (Phase 2.2). Deposit and
 * Withdraw remain out of scope — appending them later is one more object
 * here, no structural change.
 */
const TABS = [
  { to: "/account", label: "Overview", end: true },
  { to: "/account/details", label: "Details", end: true },
  { to: "/account/transactions", label: "Transactions", end: true },
  { to: "/account/transfer", label: "Transfer", end: false },
  { to: "/account/return-requests", label: "Return Requests", end: true },
];

export default function AccountModuleHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="account-page__head">
      <div>
        <div className="account-page__eyebrow">
          <Landmark size={13} strokeWidth={2.5} />
          {eyebrow || "Account Module"}
        </div>
        <h1 className="account-page__title">{title}</h1>
        {subtitle && <p className="account-page__subtitle">{subtitle}</p>}
      </div>

      <nav className="account-tabs-scroller" aria-label="Account module navigation">
        <div className="account-tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `account-tabs__link ${isActive ? "account-tabs__link--active" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    className="account-tabs__pill"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
        </div>
      </nav>
    </div>
  );
}
