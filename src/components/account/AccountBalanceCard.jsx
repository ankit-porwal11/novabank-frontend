import { Wallet } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { formatCurrency, titleCase, accountStatusTone } from "./accountFormat.js";
import "./AccountBalanceCard.css";

export default function AccountBalanceCard({ account }) {
  return (
    <Card padding="lg" className="balance-card">
      <div className="balance-card__top">
        <span className="balance-card__icon">
          <Wallet size={20} strokeWidth={2.1} />
        </span>
        <Badge tone={accountStatusTone(account?.status)}>
          {account?.status ? `${titleCase(account.status)} Account` : "Account"}
        </Badge>
      </div>

      <p className="balance-card__label">Current balance</p>
      <p className="balance-card__amount">{formatCurrency(account?.balance, account?.currency)}</p>
      <p className="balance-card__hint">Available to spend or transfer</p>
    </Card>
  );
}
