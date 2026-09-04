import { AlertTriangle } from "lucide-react";
import AcceptOrderButton from "./AcceptOrderButton.jsx";
import RedispatchButton from "./RedispatchButton.jsx";
import "./OrderActionBanner.css";

/**
 * Verified backend flow (confirmed via Postman): OUT_FOR_DELIVERY happens
 * BEFORE AWAITING_CUSTOMER_ACCEPTANCE — acceptance only becomes valid once
 * the backend explicitly reaches AWAITING_CUSTOMER_ACCEPTANCE. Showing
 * Accept Order at OUT_FOR_DELIVERY (the previous bug) let the frontend
 * accept before the backend's own acceptance window opened, which the
 * backend would later reject/fail.
 *   OUT_FOR_DELIVERY              → informational only, no button
 *   AWAITING_CUSTOMER_ACCEPTANCE  → "Your order is ready for acceptance" + Accept Order
 *   RETURNED_TO_BRANCH            → "Your order has been returned to branch" + Request Reattempt
 *   BRANCH_VISIT_REQUIRED         → "Branch Visit Required" + collect-from-branch message, no button
 * Any other status renders nothing (no banner).
 */
export default function OrderActionBanner({ order }) {
  if (!order) return null;

  if (order.status === "OUT_FOR_DELIVERY") {
    return (
      <div className="order-banner order-banner--warning">
        <AlertTriangle size={16} strokeWidth={2.2} />
        <span className="order-banner__text">Your order is out for delivery</span>
      </div>
    );
  }

  if (order.status === "AWAITING_CUSTOMER_ACCEPTANCE") {
    return (
      <div className="order-banner order-banner--warning">
        <AlertTriangle size={16} strokeWidth={2.2} />
        <span className="order-banner__text">Your order is ready for acceptance</span>
        <AcceptOrderButton order={order} />
      </div>
    );
  }

  if (order.status === "RETURNED_TO_BRANCH") {
    return (
      <div className="order-banner order-banner--danger">
        <AlertTriangle size={16} strokeWidth={2.2} />
        <span className="order-banner__text">Your order has been returned to branch</span>
        <RedispatchButton order={order} />
      </div>
    );
  }

  if (order.status === "BRANCH_VISIT_REQUIRED") {
    return (
      <div className="order-banner order-banner--darkred">
        <AlertTriangle size={16} strokeWidth={2.2} />
        <div>
          <p className="order-banner__text">Branch Visit Required</p>
          <p className="order-banner__subtext">Please collect your item from nearest branch.</p>
        </div>
      </div>
    );
  }

  return null;
}
