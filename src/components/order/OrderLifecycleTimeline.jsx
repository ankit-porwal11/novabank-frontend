import { CheckCircle2, RotateCcw } from "lucide-react";
import { formatDate, formatDateTime, orderStatusLabel } from "./orderFormat.js";
import "./OrderTimeline.css";

/**
 * History tab's lifecycle-event timeline. Verified via Postman: GET
 * /order/details/:orderId returns { order, trackingHistory,
 * redispatchHistory } where trackingHistory is an array of real entries
 * shaped { status, location? }. That array logs every courier scan, so the
 * SAME status (e.g. TRACKING_GENERATED) can repeat multiple times with
 * different (or no) location as the courier moves between cities — that's
 * Track-page checkpoint detail, not a History lifecycle event.
 *
 * This renders one entry per DISTINCT status change (deduplicating
 * consecutive repeats caused by location-only differences), which is
 * exactly the "major lifecycle events" view the spec wants: Order
 * Created, Tracking Generated, Out For Delivery, Delivered, etc. —
 * without the Mumbai/Surat/Ratlam courier-hop noise.
 *
 * redispatchHistory entries (shape not fully confirmed) are merged in
 * defensively — real fields are used if present, nothing is invented if
 * they're not.
 *
 * "Order Created" is always shown first using the order's real createdAt
 * timestamp. If trackingHistory is empty, only Order Created + the
 * current status are shown — no fabricated intermediate steps.
 */
export default function OrderLifecycleTimeline({ order, trackingHistory = [], redispatchHistory = [] }) {
  if (!order) return null;

  const rows = [
    {
      key: "created",
      icon: CheckCircle2,
      label: "Order Created",
      detail: formatDate(order.createdAt),
    },
  ];

  // Deduplicate consecutive same-status entries from real trackingHistory
  // data — collapses courier-hop noise into one lifecycle event per
  // actual status change, using only real backend data.
  let lastStatus = null;
  for (const entry of trackingHistory) {
    if (!entry?.status || entry.status === lastStatus) continue;
    lastStatus = entry.status;
    rows.push({
      key: `status-${rows.length}`,
      icon: CheckCircle2,
      label: orderStatusLabel(entry.status),
      detail: entry.status === "TRACKING_GENERATED" && order.trackingNumber
        ? `Tracking Number: ${order.trackingNumber}`
        : null,
    });
  }

  // Reattempt/redispatch events — real data if the backend provides it,
  // read defensively since the exact field shape wasn't confirmed.
  for (const [i, rd] of redispatchHistory.entries()) {
    const label = rd.status || rd.stage || rd.event || "Reattempt Requested";
    const when = rd.date || rd.timestamp || rd.createdAt;
    rows.push({
      key: `redispatch-${i}`,
      icon: RotateCcw,
      label: typeof label === "string" && /^[A-Z_]+$/.test(label) ? orderStatusLabel(label) : label,
      detail: when ? formatDateTime(when) : null,
    });
  }

  // trackingHistory covered every status up to the last logged scan — if
  // the order's real current status is different (nothing yet logged for
  // it), show it too, still using only the real status field.
  if (order.status && order.status !== lastStatus) {
    rows.push({ key: "current", icon: CheckCircle2, label: orderStatusLabel(order.status), detail: null });
  }

  return (
    <div className="order-timeline">
      {rows.map((row) => (
        <div className="order-timeline__item" key={row.key}>
          <row.icon size={16} strokeWidth={2.2} className="order-timeline__icon--done" />
          <div>
            <p className="order-timeline__label">{row.label}</p>
            {row.detail && <p className="order-timeline__sublabel text-mono">{row.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
