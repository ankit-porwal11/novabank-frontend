import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import Spinner from "../ui/Spinner.jsx";
import OrderLifecycleTimeline from "./OrderLifecycleTimeline.jsx";
import RedispatchButton from "./RedispatchButton.jsx";
import { useOrderDetails } from "../../hooks/useOrders.js";
import { itemTypeLabel, orderStatusLabel, orderStatusTone } from "./orderFormat.js";
import "./OrderHistoryCard.css";

/**
 * Bug fix: History's lifecycle events (Order Created / Tracking Generated
 * / Out For Delivery / Delivered / etc.) only exist in GET
 * /order/details/:orderId's trackingHistory + redispatchHistory fields —
 * they are NOT part of GET /order/current's flat order shape (itemType,
 * trackingNumber, status, currentLocation only, verified via Postman).
 * So each history card fetches its own order's full details to get real
 * lifecycle data, rather than guessing at fields that don't exist on the
 * summary-list order object.
 */
export default function OrderHistoryCard({ order }) {
  const { data, isLoading } = useOrderDetails(order._id);
  const trackingHistory = data?.trackingHistory || [];
  const redispatchHistory = data?.redispatchHistory || [];
  // Fall back to the summary-list order (real data either way) while the
  // detail fetch is in flight, so the card header never blanks out.
  const fullOrder = data?.order || order;

  return (
    <Card padding="lg" hoverable className="order-history-card">
      <div className="order-history-card__head">
        <p className="order-history-card__item-type">{itemTypeLabel(fullOrder.itemType)}</p>
        <Badge tone={orderStatusTone(fullOrder.status)}>{orderStatusLabel(fullOrder.status)}</Badge>
      </div>

      {isLoading ? (
        <div className="order-history-card__loading">
          <Spinner size={20} />
        </div>
      ) : (
        <OrderLifecycleTimeline
          order={fullOrder}
          trackingHistory={trackingHistory}
          redispatchHistory={redispatchHistory}
        />
      )}

      {/* "Reattempt Available" per spec — shown only when the backend
          reports the order as returned to branch. */}
      {fullOrder.status === "RETURNED_TO_BRANCH" && (
        <div className="order-history-card__reattempt">
          <p className="order-history-card__reattempt-label">
            Reattempt Available — your order can be redispatched.
          </p>
          <RedispatchButton order={fullOrder} />
        </div>
      )}

      {fullOrder.status === "BRANCH_VISIT_REQUIRED" && (
        <div className="order-history-card__reattempt">
          <p className="order-history-card__reattempt-label">
            Branch Visit Required — please visit your nearest branch to collect your item.
          </p>
        </div>
      )}
    </Card>
  );
}
