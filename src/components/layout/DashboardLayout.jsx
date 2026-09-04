import { useEffect, useState } from "react";
import { useOutlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar, { MobileSidebarDrawer } from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import "./DashboardLayout.css";

const TITLES = {
  "/dashboard": "Overview",
  "/account": "Account Overview",
  "/account/details": "Account Details",
  "/account/transactions": "Transactions",
  "/account/transfer": "Transfer",
  "/account/transfer/success": "Transfer Successful",
  "/account/return-request/new": "Request a Return",
  "/account/return-requests": "Return Requests",
  "/orders": "Orders",
  "/orders/passbook": "Passbook Request",
  "/orders/cheque-book": "Cheque Book Request",
  "/orders/card": "Debit Card",
  "/orders/card/request": "Card Request",
  "/orders/history": "Order History",
  "/profile": "Profile",
  "/settings": "Settings",
  "/settings/security": "Security",

  // AI Form Assistant module — additive only.
  "/ai-form-assistant": "AI Form Assistant",
  "/ai-form-assistant/missing-fields": "Complete Your Form",
  "/ai-form-assistant/preview": "Form Preview",
  "/ai-form-assistant/update": "Update Your Form",
};

/**
 * Renders the current routed page inside the AnimatePresence transition.
 *
 * Bug this fixes: <Outlet /> is a live component that stays subscribed to
 * the router's location context for as long as it's mounted. AnimatePresence
 * keeps the OLD motion.div genuinely mounted (not frozen) while it plays its
 * exit animation — so a <Outlet /> sitting inside that still-mounted old
 * wrapper re-renders to the NEW route the instant the URL changes, i.e.
 * before the wrapper's own key/exit animation has resolved. The visible
 * result: the pane that's fading out silently swaps to the new page's
 * content and then fades itself to opacity 0 — while the wrapper that was
 * supposed to fade the new page IN never receives a fresh mount, since
 * AnimatePresence never saw an actual add/remove of tracked children. It
 * can get stuck blank until a full reload remounts everything from scratch.
 *
 * Fix: useOutlet() captures a concrete element for the current route once,
 * at this render, instead of a live-subscribing <Outlet />. That captured
 * element doesn't self-update while it's the "exiting" child, so the old
 * page's content stays the old page's content until it actually unmounts —
 * and the new page reliably gets its own fresh, keyed motion.div and plays
 * its enter animation. Same transition values as before; only the source
 * of the rendered child changed.
 */
function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="dashboard-outlet"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const title =
    TITLES[location.pathname] ||
    (location.pathname.startsWith("/orders/track/") ? "Track Order" : "NovaBank");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dashboard-locked");
    return () => root.classList.remove("dashboard-locked");
  }, []);

  return (
    <div className="dashboard-shell">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="dashboard-shell__sidebar-slot"
      >
        <Sidebar />
      </motion.div>

      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="dashboard-main">
        <motion.div
          className="dashboard-shell__chrome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <Topbar
            title={title}
            mobileNavOpen={mobileNavOpen}
            onMenuClick={() => setMobileNavOpen(true)}
          />
        </motion.div>
        <main className="dashboard-content">
          <div className="content-container">
            {/* Sidebar/Topbar above stay mounted across sub-navigation —
                only this content pane transitions between Dashboard,
                Account (Overview/Details/Transactions), Profile, Settings,
                and Security. See AnimatedOutlet above for why this can't
                be a plain <Outlet /> wrapped inline here. */}
            <AnimatedOutlet />
          </div>
        </main>
      </div>
    </div>
  );
}
