import { Link } from "react-router-dom";
import { Send, ListOrdered, CreditCard, ShieldCheck, Settings, ChevronRight } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import "./QuickActionsPanel.css";

const ACTIONS = [
  { to: "/account/transfer", label: "Transfer money", icon: Send },
  { to: "/account/transactions", label: "View transactions", icon: ListOrdered },
  { to: "/account/details", label: "Account details", icon: CreditCard },
  { to: "/settings/security", label: "Security", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader title="Quick actions" subtitle="Jump to what you need" />
      <div className="quick-actions">
        {ACTIONS.map((action) => (
          <Link key={action.to} to={action.to} className="quick-actions__item">
            <span className="quick-actions__icon">
              <action.icon size={16} strokeWidth={2.1} />
            </span>
            <span className="quick-actions__label">{action.label}</span>
            <ChevronRight size={16} className="quick-actions__chevron" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
