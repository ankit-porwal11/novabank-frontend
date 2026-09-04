import Card from "../ui/Card.jsx";
import TiltCard from "../motion/TiltCard.jsx";
import "./AccountStatCard.css";

/**
 * Reusable glass stat tile. Used for Balance / Account Type / Status /
 * Created Date on Overview, and again (same component, no restyle) for
 * the information rows on the Details page — one visual language across
 * the module.
 */
export default function AccountStatCard({ icon: Icon, label, value, hint, tone = "default" }) {
  return (
    <TiltCard maxTilt={3} className="account-stat-tilt">
      <Card padding="md" hoverable className={`account-stat account-stat--${tone}`}>
        <div className="account-stat__icon">{Icon && <Icon size={18} strokeWidth={2.1} />}</div>
        <p className="account-stat__label">{label}</p>
        <p className="account-stat__value">{value ?? "—"}</p>
        {hint && <p className="account-stat__hint">{hint}</p>}
      </Card>
    </TiltCard>
  );
}
