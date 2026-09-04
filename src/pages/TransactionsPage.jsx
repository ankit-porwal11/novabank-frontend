import { AlertTriangle } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import AccountGate from "../components/account/AccountGate.jsx";
import BankCard from "../components/account/BankCard.jsx";
import TransactionList from "../components/account/TransactionList.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Card from "../components/ui/Card.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import { useUserStore } from "../stores/userStore.js";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import "../styles/account.css";

function TransactionsContent() {
  const { data: transactions, isLoading, isError, error } = useTransactions();

  if (isLoading) {
    return (
      <div className="account-gate-loading">
        <Spinner size={26} />
        <p>Loading your transactions…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card padding="lg" className="account-gate-error">
        <AlertTriangle size={22} strokeWidth={2} />
        <p className="account-gate-error__title">Couldn't load transactions</p>
        <p className="account-gate-error__message">
          {error?.response?.data?.message || "Something went wrong. Please try again."}
        </p>
      </Card>
    );
  }

  return <TransactionList transactions={transactions || []} />;
}

export default function TransactionsPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Transactions"
        subtitle="Every deposit, withdrawal, transfer, and return on your account."
      />

      {/* Gated on account existence first — a no-account session has no
          transactions to fetch, so it gets the same premium empty state
          as Overview/Details rather than a separate transactions-specific
          message. */}
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
            <StaggerItem>
              <TransactionsContent />
            </StaggerItem>
          </StaggerGroup>
        )}
      </AccountGate>
    </div>
  );
}
