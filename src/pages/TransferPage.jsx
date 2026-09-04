import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import AccountGate from "../components/account/AccountGate.jsx";
import BankCard from "../components/account/BankCard.jsx";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useUserStore } from "../stores/userStore.js";
import { useTransfer } from "../hooks/useTransfer.js";
import { formatCurrency } from "../components/account/accountFormat.js";
import { recordRecentTransfer } from "../components/account/returnEligibility.js";
import "../styles/account.css";
import "./TransferPage.css";

// Mirrors Backend/src/controllers/transfer.controller.js's own rules
// exactly — the backend is the authority; this only avoids a round trip
// for obviously-invalid input.
export const MAX_TRANSFER_AMOUNT = 50000;

function validate({ receiverAccountNumber, amount }) {
  const errors = {};
  if (!receiverAccountNumber?.trim()) {
    errors.receiverAccountNumber = "Receiver account number is required.";
  }
  const amountNum = Number(amount);
  if (!amount) {
    errors.amount = "Amount is required.";
  } else if (!Number.isInteger(amountNum)) {
    errors.amount = "Only whole amounts are allowed.";
  } else if (amountNum <= 0) {
    errors.amount = "Amount must be greater than 0.";
  } else if (amountNum > MAX_TRANSFER_AMOUNT) {
    errors.amount = `Maximum transfer limit is ${formatCurrency(MAX_TRANSFER_AMOUNT)}.`;
  }
  return errors;
}

function TransferForm({ account }) {
  const navigate = useNavigate();
  const { mutate: transfer, isPending } = useTransfer();

  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const amountNum = Number(amount) || 0;
  const balance = account?.balance ?? 0;
  const balanceAfter = balance - amountNum;
  const isFormFilled = receiverAccountNumber.trim() && amount;

  function handleSubmit(e) {
    e.preventDefault();
    if (isPending) return; // prevent duplicate submit while a request is in flight

    const fieldErrors = validate({ receiverAccountNumber, amount });
    setErrors(fieldErrors);
    setServerError("");
    if (Object.keys(fieldErrors).length > 0) return;

    // A brand-new idempotency key for every single attempt — required so
    // a genuine retry after a failure is never mistaken by the backend
    // for a duplicate of a prior (possibly still-processing) transfer.
    const idempotencKey = crypto.randomUUID();

    transfer(
      { receiverAccountNumber: receiverAccountNumber.trim(), amount: amountNum, idempotencKey },
      {
        onSuccess: (transaction) => {
          // Captures the real transfer id from this exact response — the
          // same object TransferSuccessPage uses below — so the Return
          // Request Eligibility card can still find it later even though
          // the passbook (GET /account/transaction) never includes an id
          // itself. See returnEligibility.js module doc for why.
          recordRecentTransfer(transaction, receiverAccountNumber.trim());
          navigate("/account/transfer/success", {
            state: { transaction, receiverAccountNumber: receiverAccountNumber.trim() },
          });
        },
        onError: (error) => {
          setServerError(error.response?.data?.message || "Transfer failed. Please try again.");
        },
      }
    );
  }

  return (
    <div className="account-layout">
      <StaggerItem>
        <Card padding="lg">
          <CardHeader title="Send money" subtitle="Transfer to another NovaBank account" />
          <form className="transfer-form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Receiver account number"
              placeholder="e.g. 2026895340"
              value={receiverAccountNumber}
              onChange={(e) => setReceiverAccountNumber(e.target.value)}
              error={errors.receiverAccountNumber}
              disabled={isPending}
            />
            <Input
              label="Amount"
              type="number"
              inputMode="numeric"
              min="1"
              max={MAX_TRANSFER_AMOUNT}
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              hint={!errors.amount ? `Up to ${formatCurrency(MAX_TRANSFER_AMOUNT)} per transfer` : undefined}
              disabled={isPending}
            />

            {serverError && <p className="transfer-form__server-error">{serverError}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isPending}
              disabled={!isFormFilled}
              leftIcon={<Send size={16} strokeWidth={2.25} />}
            >
              Transfer money
            </Button>
          </form>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card padding="lg" className="transfer-summary">
          <CardHeader title="Transfer summary" />
          <div className="transfer-summary__row">
            <span className="transfer-summary__label">From</span>
            <span className="transfer-summary__value text-mono">
              {account?.accountNumber || "—"}
            </span>
          </div>
          <div className="transfer-summary__row">
            <span className="transfer-summary__label">To</span>
            <span className="transfer-summary__value text-mono">
              {receiverAccountNumber.trim() || "—"}
            </span>
          </div>
          <div className="transfer-summary__divider" />
          <div className="transfer-summary__row">
            <span className="transfer-summary__label">Current balance</span>
            <span className="transfer-summary__value">{formatCurrency(balance, account?.currency)}</span>
          </div>
          <div className="transfer-summary__row">
            <span className="transfer-summary__label">Transfer amount</span>
            <span className="transfer-summary__value">
              {amountNum > 0 ? formatCurrency(amountNum, account?.currency) : "—"}
            </span>
          </div>
          <div className="transfer-summary__row transfer-summary__row--total">
            <span className="transfer-summary__label">Balance after</span>
            <span
              className={`transfer-summary__value ${
                amountNum > 0 && balanceAfter < 0 ? "transfer-summary__value--negative" : ""
              }`}
            >
              {amountNum > 0
                ? formatCurrency(balanceAfter, account?.currency)
                : formatCurrency(balance, account?.currency)}
            </span>
          </div>
          {amountNum > 0 && balanceAfter < 0 && (
            <p className="transfer-summary__warning">Insufficient balance for this transfer.</p>
          )}
        </Card>
      </StaggerItem>
    </div>
  );
}

export default function TransferPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Transfer"
        subtitle="Send money to another NovaBank account instantly."
      />

      <AccountGate>
        {(account) => (
          <StaggerGroup className="account-page">
            <StaggerItem>
              <BankCard
                account={account}
                holderName={account?.user?.fullName || user?.fullName}
                size="sm"
              />
            </StaggerItem>
            <TransferForm account={account} />
          </StaggerGroup>
        )}
      </AccountGate>
    </div>
  );
}
