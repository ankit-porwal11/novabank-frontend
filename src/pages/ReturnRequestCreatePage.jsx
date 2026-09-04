import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { RotateCcw, AlertTriangle } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useCreateReturnRequest } from "../hooks/useCreateReturnRequest.js";
import { recordReturnRequestCreated } from "../components/account/returnEligibility.js";
import "../styles/account.css";
import "./ReturnRequestCreatePage.css";

export default function ReturnRequestCreatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawTransactionId = searchParams.get("transactionId");
  // Defensive: treat a missing param the same as the literal strings
  // "undefined"/"null" (which URLSearchParams reports as truthy, since
  // they're real 9/4-character strings) — both mean "no real transaction
  // was passed in", so both should show the same visible error rather
  // than silently building a request against a bogus ID.
  const transactionId =
    rawTransactionId && rawTransactionId !== "undefined" && rawTransactionId !== "null"
      ? rawTransactionId
      : null;
  const { mutate: createReturnRequest, isPending } = useCreateReturnRequest();

  const [reason, setReason] = useState("");
  const [serverError, setServerError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (isPending || !transactionId) return;
    setServerError("");

    createReturnRequest(
      { transactionId, reason: reason.trim() },
      {
        onSuccess: () => {
          // The backend has just confirmed a return request now exists for
          // this exact transactionId — record that real confirmation so
          // its "Request Return" button(s) elsewhere show as already
          // requested, even after navigating away or refreshing.
          recordReturnRequestCreated(transactionId);
          navigate("/account/return-requests");
        },
        onError: (error) => {
          setServerError(error.response?.data?.message || "Couldn't submit return request.");
        },
      }
    );
  }

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Request a return"
        subtitle="Ask the receiver to send this transfer back."
      />

      <StaggerGroup className="account-page">
        {!transactionId ? (
          // Visible, debuggable state instead of a silent redirect — if
          // this is ever reached in practice (e.g. a bookmarked or
          // hand-typed link missing the param), it's immediately obvious
          // what went wrong rather than the user landing on an unrelated
          // page with no explanation.
          <StaggerItem>
            <Card padding="lg" className="return-request-form-card">
              <div className="return-request-form__missing">
                <AlertTriangle size={22} strokeWidth={2} />
                <p className="return-request-form__missing-title">No transaction selected</p>
                <p className="return-request-form__missing-message">
                  This page needs a transaction to request a return for. Open it from a
                  transaction's "Return request for refund" action instead of visiting it
                  directly.
                </p>
                <Link to="/account/transactions" className="btn btn--secondary btn--md">
                  Go to transactions
                </Link>
              </div>
            </Card>
          </StaggerItem>
        ) : (
          <StaggerItem>
            <Card padding="lg" className="return-request-form-card">
              <CardHeader
                title="Return request details"
                subtitle="The receiver will be notified and can approve or decline this request."
              />

              <form className="return-request-form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label className="field__label" htmlFor="txn-id">
                    Transaction
                  </label>
                  <div className="field__control return-request-form__txn">
                    <span className="text-mono">{transactionId}</span>
                  </div>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="reason">
                    Reason <span className="return-request-form__optional">(optional)</span>
                  </label>
                  <div className="field__control field__control--textarea">
                    <textarea
                      id="reason"
                      className="field__input field__input--textarea"
                      placeholder="e.g. Wrong transfer, sent to the wrong account…"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      maxLength={500}
                      rows={4}
                      disabled={isPending}
                    />
                  </div>
                  <p className="field__message">{reason.length}/500</p>
                </div>

                {serverError && <p className="return-request-form__server-error">{serverError}</p>}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isPending}
                  leftIcon={<RotateCcw size={16} strokeWidth={2.1} />}
                >
                  Submit return request
                </Button>
              </form>
            </Card>
          </StaggerItem>
        )}
      </StaggerGroup>
    </div>
  );
}
