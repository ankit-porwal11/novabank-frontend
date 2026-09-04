import { useParams } from "react-router-dom";
import { AlertTriangle, Radar } from "lucide-react";
import OrderModuleHeader from "../components/order/OrderModuleHeader.jsx";
import OrderTimeline from "../components/order/OrderTimeline.jsx";
import AcceptOrderButton from "../components/order/AcceptOrderButton.jsx";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useOrderDetails } from "../hooks/useOrders.js";
import { itemTypeLabel, orderStatusLabel, orderStatusTone } from "../components/order/orderFormat.js";
import "../styles/account.css";
import "../styles/order.css";

export default function OrderTrackPage() {
  const { orderId } = useParams();

  // Spec corner case #4 "Track Now": cache tracking data, refresh every
  // 30 seconds — not on every render/interaction. Also corner case #11
  // "Refresh Protection": GET /order/details/:orderId is the single
  // source re-read on every mount, so a page refresh always restores real
  // state.
  const { data, isLoading, isError, error } = useOrderDetails(orderId, {
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });

  // Bug fix (verified via Postman): GET /order/details/:orderId returns
  // { order, trackingHistory, redispatchHistory } — the order's own
  // fields (status, trackingNumber, currentLocation, itemType) are nested
  // under `order`, not top-level. Previously this page read `data.status`
  // etc. directly, which is always undefined against the real response
  // shape — that's why fields appeared missing/blank regardless of what
  // the backend actually had.
  const order = data?.order;
  const trackingHistory = data?.trackingHistory || [];

  return (
    <div className="account-page">
      <OrderModuleHeader title="Track Order" subtitle="Live status for your order." />

      {isLoading ? (
        <div className="account-gate-loading">
          <Spinner size={26} />
          <p>Loading tracking details…</p>
        </div>
      ) : isError ? (
        <Card padding="lg" className="account-gate-error">
          <AlertTriangle size={22} strokeWidth={2} />
          <p className="account-gate-error__title">Couldn't load tracking details</p>
          <p className="account-gate-error__message">
            {error?.response?.data?.message || "Something went wrong. Please try again."}
          </p>
        </Card>
      ) : (
        <StaggerGroup className="account-page">
          <StaggerItem>
            <Card padding="lg">
              <div className="order-track__head">
                <div>
                  <p className="order-track__item-type">{itemTypeLabel(order?.itemType)}</p>
                  <Badge tone={orderStatusTone(order?.status)}>{orderStatusLabel(order?.status)}</Badge>
                </div>
                <Radar size={22} strokeWidth={1.8} className="order-track__icon" />
              </div>

              <div className="order-track__meta">
                <div>
                  <p className="order-track__meta-label">Tracking number</p>
                  <p className="order-track__meta-value text-mono">
                    {order?.trackingNumber || "Not generated yet"}
                  </p>
                </div>
                <div>
                  <p className="order-track__meta-label">Current location</p>
                  <p className="order-track__meta-value">{order?.currentLocation || "—"}</p>
                </div>
              </div>

              {/* Verified backend flow: OUT_FOR_DELIVERY happens before
                  AWAITING_CUSTOMER_ACCEPTANCE — Accept Order must only
                  appear once the backend explicitly reaches the latter. */}
              {order?.status === "OUT_FOR_DELIVERY" && (
                <div className="order-banner order-banner--warning">
                  <AlertTriangle size={16} strokeWidth={2.2} />
                  <span className="order-banner__text">Order Out For Delivery</span>
                </div>
              )}
              {order?.status === "AWAITING_CUSTOMER_ACCEPTANCE" && (
                <div className="order-banner order-banner--warning">
                  <AlertTriangle size={16} strokeWidth={2.2} />
                  <span className="order-banner__text">Your order is ready for acceptance</span>
                  <AcceptOrderButton order={order} />
                </div>
              )}
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card padding="lg">
              <CardHeader title="Live timeline" />
              <OrderTimeline checkpoints={trackingHistory} currentStatus={order?.status} />
            </Card>
          </StaggerItem>
        </StaggerGroup>
      )}
    </div>
  );
}
