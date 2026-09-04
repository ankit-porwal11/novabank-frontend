import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ListOrdered, RotateCcw, Landmark } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { formatCurrency, formatDate } from "../components/account/accountFormat.js";
import "../styles/account.css";
import "./TransferSuccessPage.css";

export default function TransferSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Snapshot location.state ONCE, on the render this page actually mounts
  // for. useLocation() is a live subscription — AnimatePresence keeps this
  // component genuinely mounted while it plays its exit animation, even
  // after the user has navigated to a different route (e.g. clicking
  // "Return request for refund" navigates to /account/return-request/new,
  // which has no `state`). Reading location.state directly on every render
  // would re-derive `transaction` as undefined at that point, trip the
  // "no transaction" guard below, and fire a redirect back to
  // /account/transfer out from under the user's actual navigation. The
  // lazy useState initializer runs exactly once and is immune to that.
  const [initialState] = useState(() => location.state || {});
  const { transaction, receiverAccountNumber } = initialState;

  // Landed here directly (refresh, bookmark, back-button) with no real
  // transfer result to show — send back to the Transfer page rather than
  // fabricate a success state.
  if (!transaction) {
    return <Navigate to="/account/transfer" replace />;
  }

  return (
    <div className="account-page transfer-success">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg" className="transfer-success__card">
          <motion.span
            className="transfer-success__icon"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
          >
            <CheckCircle2 size={34} strokeWidth={2} />
          </motion.span>

          <p className="transfer-success__eyebrow">Transfer successful</p>
          <p className="transfer-success__amount">{formatCurrency(transaction.amount)}</p>
          <p className="transfer-success__to">
            sent to <span className="text-mono">{receiverAccountNumber || "—"}</span>
          </p>

          <div className="transfer-success__details">
            <div className="transfer-success__row">
              <span>Transaction ID</span>
              <span className="text-mono">{transaction._id || "—"}</span>
            </div>
            <div className="transfer-success__row">
              <span>Status</span>
              <span>{transaction.status || "—"}</span>
            </div>
            <div className="transfer-success__row">
              <span>Balance after</span>
              <span>
                {transaction.balanceAfter !== undefined
                  ? formatCurrency(transaction.balanceAfter)
                  : "—"}
              </span>
            </div>
            <div className="transfer-success__row">
              <span>Date</span>
              <span>{formatDate(transaction.createdAt)}</span>
            </div>
          </div>

          <div className="transfer-success__actions">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ListOrdered size={16} strokeWidth={2.1} />}
              onClick={() => navigate("/account/transactions")}
            >
              View transactions
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<RotateCcw size={16} strokeWidth={2.1} />}
              onClick={() =>
                navigate(
                  `/account/return-request/new?transactionId=${encodeURIComponent(transaction._id)}`
                )
              }
            >
              Return request for refund
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Landmark size={16} strokeWidth={2.1} />}
              onClick={() => navigate("/account")}
            >
              Back to overview
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
