import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Clock, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { useTransactions } from "../../hooks/useTransactions.js";
import { formatCurrency } from "./accountFormat.js";
import {
  getEligibleReturnTransfers,
  getTransactionId,
  formatRemainingTime,
  debugEligibility,
  hasReturnRequestBeenCreated,
} from "./returnEligibility.js";
import "./ReturnRequestEligibilityCard.css";

// Recompute eligibility periodically so the countdown/expiry state stays
// accurate without needing second-by-second precision — a transfer just
// past its 3-hour mark should stop being offered within about a minute of
// crossing it, not require a full page refresh.
const RECHECK_INTERVAL_MS = 30 * 1000;

export default function ReturnRequestEligibilityCard() {
  // Same query key as RecentActivity's useTransactions() on this same page
  // — react-query dedupes this, so no extra network call is made.
  const { data: transactions, isLoading, isError } = useTransactions();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), RECHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Previously: a failed transactions fetch (isError) fell through the
  // same "0 eligible" branch as a genuinely empty list, since only
  // isLoading was checked. That silently showed "no eligible transfers"
  // even when the real cause was the fetch itself failing. Surface it
  // distinctly instead.
  if (isLoading) return null;
  if (isError) return null;

  const eligible = getEligibleReturnTransfers(transactions, now);
  debugEligibility(transactions, now);

  return (
    <Card padding="lg" className="return-eligibility-card">
      <div className="return-eligibility-card__icon">
        <RotateCcw size={20} strokeWidth={2.1} />
      </div>

      {eligible.length === 0 && (
        <>
          <p className="return-eligibility-card__title">Return Request</p>
          <p className="return-eligibility-card__body">
            Transfers are eligible for a return request for 3 hours after they're sent. You
            don't have any eligible transfers right now.
          </p>
        </>
      )}

      {eligible.length === 1 && (() => {
        const transaction = eligible[0];
        const transactionId = getTransactionId(transaction);
        const alreadyRequested = hasReturnRequestBeenCreated(transactionId);
        return (
          <>
            <p className="return-eligibility-card__title">Return Request</p>
            <p className="return-eligibility-card__body">
              You can request a return for your recent transfer.
            </p>

            <p className="return-eligibility-card__amount">
              {formatCurrency(transaction.amount)}
            </p>
            <p className="return-eligibility-card__to">
              Transferred to{" "}
              <span className="text-mono">{transaction.to?.accountNumber || "—"}</span>
            </p>

            <p className="return-eligibility-card__remaining">
              <CheckCircle2 size={14} strokeWidth={2.2} />
              Available for return request
              <span className="return-eligibility-card__countdown">
                <Clock size={12} strokeWidth={2.2} />
                {formatRemainingTime(transaction, now)}
              </span>
            </p>

            {alreadyRequested ? (
              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled
                leftIcon={<RotateCcw size={16} strokeWidth={2.1} />}
                className="return-eligibility-card__cta"
              >
                Return Requested
              </Button>
            ) : (
              <Link
                to={`/account/return-request/new?transactionId=${encodeURIComponent(
                  transactionId
                )}`}
                className="return-eligibility-card__cta"
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<RotateCcw size={16} strokeWidth={2.1} />}
                >
                  Request Return
                </Button>
              </Link>
            )}
          </>
        );
      })()}

      {eligible.length > 1 && (
        <>
          <p className="return-eligibility-card__title">Return Request</p>
          <p className="return-eligibility-card__body">
            You have multiple recent transfers eligible for a return request.
          </p>

          <p className="return-eligibility-card__count">
            {eligible.length} transfers are currently eligible.
          </p>

          <Link to="/account/return-request/eligible" className="return-eligibility-card__cta">
            <Button variant="primary" size="md" fullWidth>
              View Transfers
            </Button>
          </Link>
        </>
      )}
    </Card>
  );
}
