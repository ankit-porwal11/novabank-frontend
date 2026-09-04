import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore.js";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import Button from "../ui/Button.jsx";
import "./Navbar.css";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
];

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authChecked = useAuthStore((s) => s.authChecked);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Reuses the SAME current-user probe ProtectedRoute/PublicOnlyRoute use —
  // no new auth logic, just asking the existing hook to hydrate the store
  // once so the navbar can reflect a real session on a fresh landing visit.
  useCurrentUser({ enabled: !authChecked });

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className={`landing-nav ${scrolled ? "landing-nav--scrolled" : ""}`}>
      <div className="landing-nav__inner">
        <Link to="/" className="landing-nav__brand">
          <span className="landing-nav__brand-mark">
            <Landmark size={18} strokeWidth={2.25} />
          </span>
          <span>NovaBank</span>
        </Link>

        <nav className="landing-nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="landing-nav__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="landing-nav__actions">
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Open an account
              </Button>
            </>
          )}
        </div>

        <motion.button
          type="button"
          className="landing-nav__menu-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
              style={{ display: "inline-flex" }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="landing-nav__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.06, delayChildren: 0.08 }}
              style={{ paddingBottom: 8 }}
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="landing-nav__mobile-link"
                  onClick={() => setMobileOpen(false)}
                  variants={mobileLinkVariants}
                  transition={{ duration: 0.25 }}
                  whileTap={{ scale: 0.98, backgroundColor: "var(--color-surface)" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                className="landing-nav__mobile-actions"
                variants={mobileLinkVariants}
                transition={{ duration: 0.25 }}
              >
                {isAuthenticated ? (
                  <Button
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/login");
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/register");
                      }}
                    >
                      Open an account
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
