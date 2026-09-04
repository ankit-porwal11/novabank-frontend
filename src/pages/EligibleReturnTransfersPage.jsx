import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Inbox, CheckCircle2 } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import { formatCurrency } from "../components/account/accountFormat.js";
import {
  getEligibleReturnTransfers,
  getTransactionId,
  formatRemainingTime,
  debugEligibility,
  hasReturnRequestBeenCreated,
} from "../components/account/returnEligibility.js";
import "../styles/account.css";
import "../components/account/AccountGate.css";
import "./EligibleReturnTransfersPage.css";

const RECHECK_INTERVAL_MS = 30 * 1000;

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function EligibleReturnTransfersPage() {
  // Same ["transactions"] query key used elsewhere in the Account module —
  // shares react-query's cache, no duplicate network call.
  const { data: transactions, isLoading, isError, error } = useTransactions();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), RECHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const eligible = getEligibleReturnTransfers(transactions, now);
  debugEligibility(transactions, now);

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Return Requests"
        subtitle="Your eligible transfers — request a return within 3 hours of sending."
      />

      <StaggerGroup className="account-page">
        {isLoading ? (
          <div className="account-gate-loading">
            <Spinner size={26} />
            <p>Loading your transfers…</p>
          </div>
        ) : isError ? (
          <Card padding="lg" className="account-gate-error">
            <p className="account-gate-error__title">Couldn't load transactions</p>
            <p className="account-gate-error__message">
              {error?.response?.data?.message || "Something went wrong. Please try again."}
            </p>
          </Card>
        ) : eligible.length === 0 ? (
          <StaggerItem>
            <Card padding="lg" className="eligible-transfers-empty">
              <Inbox size={28} strokeWidth={1.5} />
              <p className="eligible-transfers-empty__title">No eligible transfers</p>
              <p className="eligible-transfers-empty__subtitle">
                Transfers are eligible for a return request for 3 hours after they're sent.
                None of your recent transfers are currently within that window.
              </p>
            </Card>
          </StaggerItem>
        ) : (
          <div className="eligible-transfers-grid">
            {eligible.map((transaction) => {
              const transactionId = getTransactionId(transaction);
              const alreadyRequested = hasReturnRequestBeenCreated(transactionId);
              return (
                <StaggerItem key={transactionId}>
                  <Card padding="lg" className="eligible-transfer-card">
                    <p className="eligible-transfer-card__amount">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="eligible-transfer-card__meta">
                      Transferred at {formatTime(transaction.createdAt)}
                      {transaction.to?.accountNumber && (
                        <>
                          {" "}
                          · to <span className="text-mono">{transaction.to.accountNumber}</span>
                        </>
                      )}
                    </p>

                    <p className="eligible-transfer-card__status">
                      <CheckCircle2 size={14} strokeWidth={2.2} />
                      Available for {formatRemainingTime(transaction, now)}
                    </p>

                    {alreadyRequested ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        disabled
                        leftIcon={<RotateCcw size={14} strokeWidth={2.1} />}
                        className="eligible-transfer-card__cta"
                      >
                        Return Requested
                      </Button>
                    ) : (
                      <Link
                        to={`/account/return-request/new?transactionId=${encodeURIComponent(
                          transactionId
                        )}`}
                        className="eligible-transfer-card__cta"
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          leftIcon={<RotateCcw size={14} strokeWidth={2.1} />}
                        >
                          Request Return
                        </Button>
                      </Link>
                    )}
                  </Card>
                </StaggerItem>
              );
            })}
          </div>
        )}
      </StaggerGroup>
    </div>
  );
}
