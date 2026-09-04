import { AlertTriangle, Inbox } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import AccountGate from "../components/account/AccountGate.jsx";
import BankCard from "../components/account/BankCard.jsx";
import RefundProgressCard from "../components/account/RefundProgressCard.jsx";
import Card from "../components/ui/Card.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useUserStore } from "../stores/userStore.js";
import { useMyReturnRequests } from "../hooks/useMyReturnRequests.js";
import "../styles/account.css";
import "./ReturnRequestsPage.css";

function ReturnRequestsContent() {
  const { data: requests, isLoading, isError, error } = useMyReturnRequests();

  if (isLoading) {
    return (
      <div className="account-gate-loading">
        <Spinner size={26} />
        <p>Loading your return requests…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card padding="lg" className="account-gate-error">
        <AlertTriangle size={22} strokeWidth={2} />
        <p className="account-gate-error__title">Couldn't load return requests</p>
        <p className="account-gate-error__message">
          {error?.response?.data?.message || "Something went wrong. Please try again."}
        </p>
      </Card>
    );
  }

  const list = requests || [];

  if (list.length === 0) {
    return (
      <Card padding="lg" className="return-requests-empty">
        <Inbox size={28} strokeWidth={1.5} />
        <p className="return-requests-empty__title">No return requests yet</p>
        <p className="return-requests-empty__subtitle">
          Return requests you create or that are made against your account will show up here.
        </p>
      </Card>
    );
  }

  return (
    <div className="return-requests-grid">
      {list.map((request) => (
        <RefundProgressCard key={request._id} request={request} />
      ))}
    </div>
  );
}

export default function ReturnRequestsPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Return requests"
        subtitle="Track refunds you've requested and their settlement progress."
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
            <StaggerItem>
              <ReturnRequestsContent />
            </StaggerItem>
          </StaggerGroup>
        )}
      </AccountGate>
    </div>
  );
}
