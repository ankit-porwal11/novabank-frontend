import { Mail, AtSign } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { ShieldCheck } from "lucide-react";

export default function ProfileSummaryCard({ user }) {
  const initials = (user?.fullName || user?.username || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardHeader title="Profile summary" />
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-full)",
              objectFit: "cover",
              border: "1px solid var(--color-border-strong)",
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--gradient-brand)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "var(--fs-lg)",
            }}
          >
            {initials}
          </div>
        )}
        <div>
          <p style={{ fontWeight: 700, fontSize: "var(--fs-md)" }}>{user?.fullName}</p>
          <Badge tone="success" icon={<ShieldCheck size={12} />}>
            Verified account
          </Badge>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AtSign size={15} color="var(--color-text-faint)" />
          <span className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>
            {user?.username}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Mail size={15} color="var(--color-text-faint)" />
          <span className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>
            {user?.email}
          </span>
        </div>
      </div>
    </Card>
  );
}
