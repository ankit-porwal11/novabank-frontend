import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import "../../styles/account.css";

// Exact tab order per spec: Overview, Cheque Book, Card, Passbook, History.
const TABS = [
  { to: "/orders", label: "Overview", end: true },
  { to: "/orders/cheque-book", label: "Cheque Book", end: true },
  { to: "/orders/card", label: "Card", end: false },
  { to: "/orders/passbook", label: "Passbook", end: true },
  { to: "/orders/history", label: "History", end: true },
];

export default function OrderModuleHeader({ title, subtitle }) {
  return (
    <div className="account-page__head">
      <div>
        <div className="account-page__eyebrow">
          <Package size={13} strokeWidth={2.5} />
          Order Module
        </div>
        <h1 className="account-page__title">{title}</h1>
        {subtitle && <p className="account-page__subtitle">{subtitle}</p>}
      </div>

      <nav className="account-tabs-scroller" aria-label="Order module navigation">
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
