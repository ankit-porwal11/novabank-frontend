import Card, { CardHeader } from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { formatCurrency, formatDate, accountStatusTone } from "./accountFormat.js";
import "./AccountDetailTable.css";

export default function AccountDetailTable({ account }) {
  const rows = [
    { label: "Account number", value: account?.accountNumber, mono: true },
    { label: "Account type", value: account?.accountType },
    { label: "Currency", value: account?.currency },
    { label: "Current balance", value: formatCurrency(account?.balance, account?.currency) },
    {
      label: "Status",
      value: account?.status ? (
        <Badge tone={accountStatusTone(account.status)}>{account.status}</Badge>
      ) : (
        "—"
      ),
    },
    { label: "Created on", value: formatDate(account?.createdAt) },
    { label: "Account holder", value: account?.user?.fullName },
    { label: "Username", value: account?.user?.username, mono: true },
    { label: "Email on file", value: account?.user?.email },
  ];

  return (
    <Card>
      <CardHeader title="Account details" subtitle="Everything NovaBank has on file for this account" />
      <dl className="account-detail-table">
        {rows.map((row) => (
          <div className="account-detail-table__row" key={row.label}>
            <dt className="account-detail-table__label">{row.label}</dt>
            <dd className={`account-detail-table__value ${row.mono ? "text-mono" : ""}`}>
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
