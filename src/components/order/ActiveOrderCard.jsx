import { Link } from "react-router-dom";
import { Radar } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import OrderActionBanner from "./OrderActionBanner.jsx";
import { itemTypeLabel, orderStatusLabel, orderStatusTone, getOrderTrackingNumber, getOrderCurrentLocation, getOrderItemType } from "./orderFormat.js";
import "./ActiveOrderCard.css";

export default function ActiveOrderCard({ order }) {
  return (
    <Card padding="md" hoverable className="active-order-card">
      <div className="active-order-card__top">
        <div>
          <p className="active-order-card__item-type">{itemTypeLabel(getOrderItemType(order))}</p>
          <Badge tone={orderStatusTone(order.status)}>{orderStatusLabel(order.status)}</Badge>
        </div>
        <Link to={`/orders/track/${order._id}`} className="btn btn--secondary btn--sm">
          <Radar size={14} strokeWidth={2.1} />
          Track Now
        </Link>
      </div>

      <div className="active-order-card__meta">
        <div>
          <p className="active-order-card__meta-label">Tracking number</p>
          <p className="active-order-card__meta-value text-mono">
            {getOrderTrackingNumber(order) || "Not generated yet"}
          </p>
        </div>
        <div>
          <p className="active-order-card__meta-label">Current location</p>
          <p className="active-order-card__meta-value">{getOrderCurrentLocation(order) || "—"}</p>
        </div>
      </div>

      <OrderActionBanner order={order} />
    </Card>
  );
}
