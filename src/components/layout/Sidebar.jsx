import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { LayoutDashboard, User, ShieldCheck, Settings, Landmark, Package, X } from "lucide-react";
import AiFormAssistantCard from "../dashboard/AiFormAssistantCard.jsx";
import "./Sidebar.css";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/account", label: "Account", icon: Landmark },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings/security", label: "Security", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

function isLinkActive(to, pathname) {
  return to === "/dashboard" || to === "/settings"
    ? pathname === to
    : pathname.startsWith(to);
}

function SidebarBottom({ onNavigate }) {
  return (
    <div className="sidebar__bottom">
      <AiFormAssistantCard variant="sidebar" onNavigate={onNavigate} />
      <div className="sidebar__footer">
        <div className="sidebar__footer-badge">
          <ShieldCheck size={14} strokeWidth={2.25} />
          <span>256-bit encrypted session</span>
        </div>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="sidebar__brand">
      <span className="sidebar__brand-mark">
        <Landmark size={20} strokeWidth={2.25} />
      </span>
      <span className="sidebar__brand-name">NovaBank</span>
    </div>
  );
}

function NavList({ layoutId, onNavigate }) {
  const location = useLocation();

  return (
    <nav className="sidebar__nav">
      {NAV_ITEMS.map(({ to, label, icon: Icon }, index) => {
        const isActive = isLinkActive(to, location.pathname);

        return (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] }}
          >
            <NavLink
              to={to}
              end={to === "/dashboard" || to === "/settings"}
              onClick={onNavigate}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="sidebar__active-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <motion.span
                className="sidebar__link-icon"
                whileHover={{ scale: 1.12, rotate: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <Icon size={18} strokeWidth={2} />
              </motion.span>
              <span>{label}</span>
            </NavLink>
          </motion.div>
        );
      })}
    </nav>
  );
}

/**
 * Desktop/tablet sidebar. Pinned by .dashboard-shell (position:fixed;
 * inset:0). Visible at every viewport width >= 768px — including whatever
 * width remains once Chrome DevTools is docked. Below 768px this is hidden
 * via CSS and replaced by <MobileSidebarDrawer>.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <BrandMark />
      </motion.div>

      <NavList layoutId="sidebar-active-indicator" />

      <SidebarBottom />
    </aside>
  );
}

/**
 * Mobile-only overlay drawer (< 768px). Triggered from Topbar's hamburger
 * button. Shares the exact same NAV_ITEMS/active-state logic as the
 * desktop sidebar via <NavList> — no duplicated route list to drift out
 * of sync.
 */
export function MobileSidebarDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sidebar-drawer__backdrop"
            initial={{ opacity: 0, pointerEvents: "none" }}
            animate={{ opacity: 1, pointerEvents: "auto" }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            id="dashboard-mobile-nav"
            className="sidebar sidebar--drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sidebar-drawer__header">
              <BrandMark />
              <button
                type="button"
                className="sidebar-drawer__close"
                onClick={onClose}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <NavList layoutId="sidebar-drawer-active-indicator" onNavigate={onClose} />

            <SidebarBottom onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
