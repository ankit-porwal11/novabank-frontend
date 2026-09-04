import { Wallet, Landmark, ShieldCheck, CalendarDays } from "lucide-react";
import AccountModuleHeader from "../components/account/AccountModuleHeader.jsx";
import AccountGate from "../components/account/AccountGate.jsx";
import BankCard from "../components/account/BankCard.jsx";
import AccountDetailTable from "../components/account/AccountDetailTable.jsx";
import AccountStatCard from "../components/account/AccountStatCard.jsx";
import AccountHealthPanel from "../components/account/AccountHealthPanel.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useUserStore } from "../stores/userStore.js";
import { formatCurrency, formatDate, titleCase, accountStatusTone } from "../components/account/accountFormat.js";
import "../styles/account.css";

export default function AccountDetailsPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="account-page">
      <AccountModuleHeader
        eyebrow="Account Module"
        title="Account Details"
        subtitle="Full record of your NovaBank account, straight from the core."
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

            <div>
              <p className="account-section-label">Summary</p>
              <div className="account-grid">
                <StaggerItem>
                  <AccountStatCard
                    icon={Wallet}
                    label="Current balance"
                    value={formatCurrency(account?.balance, account?.currency)}
                    tone="success"
                  />
                </StaggerItem>
                <StaggerItem>
                  <AccountStatCard
                    icon={Landmark}
                    label="Account type"
                    value={titleCase(account?.accountType)}
                  />
                </StaggerItem>
                <StaggerItem>
                  <AccountStatCard
                    icon={ShieldCheck}
                    label="Status"
                    value={titleCase(account?.status)}
                    tone={accountStatusTone(account?.status)}
                  />
                </StaggerItem>
                <StaggerItem>
                  <AccountStatCard
                    icon={CalendarDays}
                    label="Created on"
                    value={formatDate(account?.createdAt)}
                  />
                </StaggerItem>
              </div>
            </div>

            <div className="account-layout">
              <StaggerItem>
                <AccountDetailTable account={account} />
              </StaggerItem>
              <StaggerItem>
                <AccountHealthPanel account={account} />
              </StaggerItem>
            </div>
          </StaggerGroup>
        )}
      </AccountGate>
    </div>
  );
}
