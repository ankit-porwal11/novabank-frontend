import Card, { CardHeader } from "../ui/Card.jsx";
import "./AccountInfoCard.css";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AccountInfoCard({ user }) {
  const rows = [
    { label: "Account ID", value: user?._id, mono: true },
    { label: "Full name", value: user?.fullName },
    { label: "Email", value: user?.email },
    { label: "Username", value: user?.username, mono: true },
    { label: "Member since", value: formatDate(user?.createdAt) },
    { label: "Last updated", value: formatDate(user?.updatedAt) },
  ];

  return (
    <Card>
      <CardHeader
        title="Account information"
        subtitle="Details on file for your NovaBank account"
      />
      <dl className="account-info">
        {rows.map((row) => (
          <div className="account-info__row" key={row.label}>
            <dt className="account-info__label">{row.label}</dt>
            <dd className={`account-info__value ${row.mono ? "text-mono" : ""}`}>
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
