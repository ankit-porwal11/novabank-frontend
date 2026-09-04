import { Link } from "react-router-dom";
import { Lock, Radar } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { itemTypeLabel, orderStatusLabel, orderStatusTone, getOrderTrackingNumber, getOrderItemType } from "./orderFormat.js";
import "./ActiveOrderLockCard.css";

/**
 * Spec corner cases #7 "Duplicate Product Order Prevention" and #8 "URL
 * Manipulation Protection": if an active order of this itemType already
 * exists, the order form is hidden entirely and this card is shown
 * instead — current status, tracking number, and Track Now, no Order Now
 * button anywhere on the page.
 */
export default function ActiveOrderLockCard({ order }) {
  return (
    <Card padding="lg" className="active-order-lock">
      <div className="active-order-lock__icon">
        <Lock size={22} strokeWidth={2} />
      </div>
      <p className="active-order-lock__title">
        You already have an active {itemTypeLabel(getOrderItemType(order))} request.
      </p>

      <div className="active-order-lock__row">
        <span className="active-order-lock__label">Current Status</span>
        <Badge tone={orderStatusTone(order.status)}>{orderStatusLabel(order.status)}</Badge>
      </div>
      <div className="active-order-lock__row">
        <span className="active-order-lock__label">Tracking Number</span>
        <span className="active-order-lock__value text-mono">
          {getOrderTrackingNumber(order) || "Not generated yet"}
        </span>
      </div>

      <Link to={`/orders/track/${order._id}`} className="btn btn--primary btn--md active-order-lock__cta">
        <Radar size={15} strokeWidth={2.1} />
        Track Now
      </Link>
    </Card>
  );
}
