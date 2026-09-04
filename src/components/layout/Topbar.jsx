import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "../../stores/userStore.js";
import { useLogout } from "../../hooks/useLogout.js";
import "./Topbar.css";

export default function Topbar({ title = "Overview", onMenuClick, mobileNavOpen = false }) {
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate("/login", { replace: true }),
    });
  }

  const initials = (user?.fullName || user?.username || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="topbar__menu-trigger"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-mobile-nav"
        >
          <Menu size={20} />
        </button>
        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__actions" ref={menuRef}>
        <motion.button
          type="button"
          className="topbar__profile-trigger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          whileHover={{ borderColor: "var(--color-border-strong)" }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="topbar__avatar-wrap">
            <motion.span
              className="topbar__session-pulse"
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            {user?.avatar ? (
              <motion.img
                src={user.avatar}
                alt=""
                className="topbar__avatar"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              />
            ) : (
              <motion.span
                className="topbar__avatar topbar__avatar--fallback"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                {initials}
              </motion.span>
            )}
          </span>
          <span className="topbar__username">{user?.fullName || user?.username}</span>
          <motion.span
            animate={{ rotate: menuOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ display: "inline-flex" }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="topbar__menu"
              role="menu"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="topbar__menu-header">
                <p className="topbar__menu-name">{user?.fullName}</p>
                <p className="topbar__menu-email">{user?.email}</p>
              </div>
              <motion.button
                type="button"
                className="topbar__menu-item"
                role="menuitem"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                whileHover={{ backgroundColor: "var(--color-danger-soft)" }}
              >
                <LogOut size={16} />
                <span>{logoutMutation.isPending ? "Signing out…" : "Sign out"}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
