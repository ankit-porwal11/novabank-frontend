import { CreditCard, Landmark, ShieldCheck, CalendarDays } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import AccountGate from "../components/account/AccountGate.jsx";
import BankCard from "../components/account/BankCard.jsx";
import AccountBalanceCard from "../components/account/AccountBalanceCard.jsx";
import AccountHealthPanel from "../components/account/AccountHealthPanel.jsx";
import AccountStatCard from "../components/account/AccountStatCard.jsx";
import QuickActionsPanel from "../components/account/QuickActionsPanel.jsx";
import RefundStatusPanel from "../components/account/RefundStatusPanel.jsx";
import ReturnRequestEligibilityCard from "../components/account/ReturnRequestEligibilityCard.jsx";
import TransactionList from "../components/account/TransactionList.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useUserStore } from "../stores/userStore.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { formatDate, titleCase, accountStatusTone } from "../components/account/accountFormat.js";
import { Link } from "react-router-dom";
import "../styles/account.css";

function RecentActivity() {
  const { data: transactions } = useTransactions();

  return (
    <TransactionList
      transactions={transactions || []}
      compact
      limit={5}
      title="Recent transactions"
      headerAction={
        <Link to="/account/transactions" className="btn btn--secondary btn--sm">
          View all
        </Link>
      }
    />
  );
}

export default function AccountOverviewPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Account Overview"
        subtitle="Your NovaBank account, balance, and status in one place."
      />

      <AccountGate>
        {(account) => (
          <StaggerGroup className="account-page">
            {/* Hero row: premium card + balance / health column — mirrors
                the reference layout's card-and-summary hero band. */}
            <div className="account-layout">
              <StaggerItem>
                <div className="account-hero-card">
                  <BankCard
                    account={account}
                    holderName={account?.user?.fullName || user?.fullName}
                    size="lg"
                  />
                  <div className="account-hero-card__dots" aria-hidden="true">
                    <span className="account-hero-card__dot account-hero-card__dot--active" />
                    <span className="account-hero-card__dot" />
                    <span className="account-hero-card__dot" />
                  </div>
                </div>
              </StaggerItem>

              <div className="account-summary-col">
                <StaggerItem>
                  <AccountBalanceCard account={account} />
                </StaggerItem>
                <StaggerItem>
                  <AccountHealthPanel account={account} />
                </StaggerItem>
              </div>
            </div>

            <div>
              <p className="account-section-label">Account at a glance</p>
              <div className="account-grid">
                <StaggerItem>
                  <AccountStatCard
                    icon={CreditCard}
                    label="Account number"
                    value={account?.accountNumber || "—"}
                    hint="Use for incoming transfers"
                  />
                </StaggerItem>
                <StaggerItem>
                  <AccountStatCard
                    icon={Landmark}
                    label="Account type"
                    value={titleCase(account?.accountType)}
                    hint={`${account?.currency || "—"} denominated`}
                  />
                </StaggerItem>
                <StaggerItem>
                  <AccountStatCard
                    icon={ShieldCheck}
                    label="Account status"
                    value={titleCase(account?.status)}
                    hint="Reported by NovaBank core"
                    tone={accountStatusTone(account?.status) === "success" ? "success" : "default"}
                  />
                </StaggerItem>
                <StaggerItem>
                  <AccountStatCard
                    icon={CalendarDays}
                    label="Created on"
                    value={formatDate(account?.createdAt)}
                    hint="Account opening date"
                  />
                </StaggerItem>
              </div>
            </div>

            <StaggerItem>
              <RefundStatusPanel />
            </StaggerItem>

            <StaggerItem>
              <ReturnRequestEligibilityCard />
            </StaggerItem>

            <div className="account-layout">
              <StaggerItem>
                <RecentActivity />
              </StaggerItem>
              <StaggerItem>
                <QuickActionsPanel />
              </StaggerItem>
            </div>
          </StaggerGroup>
        )}
      </AccountGate>
    </div>
  );
}
