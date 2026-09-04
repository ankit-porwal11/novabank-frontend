import { Package } from "lucide-react";
import Card from "../ui/Card.jsx";
import { isActiveOrderStatus } from "./orderFormat.js";
import "./OrderSummaryCard.css";

/**
 * "Top Hero Card" per spec — summary only, no actions. Counts are derived
 * client-side from the real order list returned by GET /order/current,
 * which is verified (via Postman) to return a user's full order set, not
 * only active ones:
 *   Total     = orders.length
 *   Active    = orders with a status in ACTIVE_ORDER_STATUSES
 *   Delivered = orders with status DELIVERED
 *   Pending   = everything else not yet delivered/active (the spec
 *               doesn't define "Pending" as its own backend status, so
 *               it's computed as the remainder rather than invented as a
 *               fake field).
 */
export default function OrderSummaryCard({ orders = [] }) {
  const total = orders.length;
  const active = orders.filter((o) => isActiveOrderStatus(o.status)).length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const pending = Math.max(total - active - delivered, 0);

  const stats = [
    { label: "Total Orders", value: total },
    { label: "Active Orders", value: active },
    { label: "Delivered Orders", value: delivered },
    { label: "Pending Orders", value: pending },
  ];

  return (
    <Card padding="lg" className="order-summary-card">
      <div className="order-summary-card__head">
        <span className="order-summary-card__icon">
          <Package size={20} strokeWidth={2.1} />
        </span>
        <div>
          <p className="order-summary-card__title">Your Orders</p>
          <p className="order-summary-card__subtitle">Summary across all products</p>
        </div>
      </div>

      <div className="order-summary-card__grid">
        {stats.map((s) => (
          <div key={s.label} className="order-summary-card__stat">
            <p className="order-summary-card__value">{s.value}</p>
            <p className="order-summary-card__label">{s.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
