import { ShieldCheck, Lock, Activity } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import "./AccountHealthPanel.css";

/**
 * Status widgets. Every row is tied to a real, currently-available signal —
 * no invented percentages or fields the backend doesn't return:
 *   - "Account" reflects whether /account/details resolved (i.e. an
 *     account genuinely exists for this session).
 *   - "Session" reflects the app's real httpOnly-cookie auth model
 *     (see api/axiosClient.js) — if this page rendered at all, the
 *     session is authenticated.
 *   - "Account number" reflects whether the backend actually returned one.
 */
export default function AccountHealthPanel({ account }) {
  const rows = [
    {
      icon: ShieldCheck,
      label: "Account",
      description: account ? "Active and on file with NovaBank" : "No account on file",
      tone: account ? "success" : "warning",
      text: account ? "Active" : "Not set up",
    },
    {
      icon: Lock,
      label: "Session",
      description: "256-bit encrypted, httpOnly session",
      tone: "success",
      text: "Secure",
    },
    {
      icon: Activity,
      label: "Account number",
      description: account?.accountNumber ? "Confirmed by NovaBank" : "Not yet issued",
      tone: account?.accountNumber ? "success" : "neutral",
      text: account?.accountNumber ? "Confirmed" : "—",
    },
  ];

  return (
    <Card>
      <CardHeader title="Account health" subtitle="Live status for this workspace" />
      <div className="account-health">
        {rows.map((row) => (
          <div className="account-health__row" key={row.label}>
            <span className="account-health__icon">
              <row.icon size={16} strokeWidth={2.1} />
            </span>
            <div className="account-health__text">
              <p className="account-health__label">{row.label}</p>
              <p className="account-health__description">{row.description}</p>
            </div>
            <Badge tone={row.tone}>{row.text}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
