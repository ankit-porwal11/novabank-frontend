import { CheckCircle2 } from "lucide-react";
import { orderStatusLabel } from "./orderFormat.js";
import "./OrderTimeline.css";

/**
 * Live checkpoint timeline for the Track page. Verified via Postman:
 * GET /order/details/:orderId returns { order, trackingHistory,
 * redispatchHistory } — trackingHistory is an array of real entries
 * shaped { status, location? } (location is present on some entries,
 * absent on others — e.g. multiple TRACKING_GENERATED entries as the
 * courier passes through different cities). This renders exactly that
 * array, in order: entries with a location show the city (matching the
 * spec's "✓ Mumbai Printing Center" style); entries without one show the
 * status label instead. No fabricated data — if trackingHistory is empty,
 * only the order's real current status is shown as the sole known point.
 */
export default function OrderTimeline({ checkpoints = [], currentStatus }) {
  if (checkpoints.length === 0) {
    return (
      <div className="order-timeline order-timeline--single">
        <div className="order-timeline__item">
          <CheckCircle2 size={16} strokeWidth={2.2} className="order-timeline__icon--done" />
          <div>
            <p className="order-timeline__label">{orderStatusLabel(currentStatus)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-timeline">
      {checkpoints.map((cp, i) => (
        <div className="order-timeline__item" key={`${cp.status}-${cp.location || ""}-${i}`}>
          <CheckCircle2 size={16} strokeWidth={2.2} className="order-timeline__icon--done" />
          <div>
            <p className="order-timeline__label">{cp.location || orderStatusLabel(cp.status)}</p>
            {cp.location && <p className="order-timeline__sublabel">{orderStatusLabel(cp.status)}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
