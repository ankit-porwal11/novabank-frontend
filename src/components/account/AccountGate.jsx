import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Card from "../ui/Card.jsx";
import Spinner from "../ui/Spinner.jsx";
import AccountEmptyState from "./AccountEmptyState.jsx";
import { useAccountDetails } from "../../hooks/useAccountDetails.js";
import "./AccountGate.css";

/**
 * Wraps every Account module page. Runs the single ['account'] query
 * (cached by TanStack Query, so Overview/Details/Transactions share one
 * network call) and renders exactly one of:
 *   - loading skeleton
 *   - the premium empty state (no account yet)
 *   - a real-error panel (network/server failure — distinct from "no account")
 *   - `children(account)` once real data is available
 */
export default function AccountGate({ children }) {
  const { data: account, isLoading, isNoAccount, isError, error } = useAccountDetails();

  // TEMP DEBUG — remove once navigation is confirmed fixed in-browser.
  console.log("[AccountGate] render", {
    path: typeof window !== "undefined" ? window.location.pathname : "",
    isLoading,
    isNoAccount,
    isError,
    hasAccount: Boolean(account),
  });

  if (isLoading) {
    return (
      <div className="account-gate-loading">
        <Spinner size={26} />
        <p>Loading your account…</p>
      </div>
    );
  }

  if (isNoAccount) {
    return <AccountEmptyState />;
  }

  if (isError) {
    return (
      <Card padding="lg" className="account-gate-error">
        <AlertTriangle size={22} strokeWidth={2} />
        <p className="account-gate-error__title">Couldn't load your account</p>
        <p className="account-gate-error__message">
          {error?.response?.data?.message || "Something went wrong. Please try again."}
        </p>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {children(account)}
    </motion.div>
  );
}
