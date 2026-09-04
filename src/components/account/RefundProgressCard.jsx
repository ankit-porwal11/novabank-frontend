import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import {
  formatCurrency,
  formatDate,
  returnRequestStatusTone,
  settlementStatusTone,
} from "./accountFormat.js";
import "./RefundProgressCard.css";

function titleCaseWords(value) {
  if (!value) return "—";
  return value
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * One ReturnRequest, visualized. All values (totalAmount, settledAmount,
 * remainingAmount, status, settlementStatus, createdAt) come straight from
 * Backend/src/models/returnRequest.model.js via GET
 * /account/return-request/my-requests — nothing here is estimated except
 * the progress-bar percentage, which the requirements explicitly allow
 * ("no fake calculations unless required for UI percentages").
 *
 * compact — smaller footprint for the Overview refund-status section.
 */
export default function RefundProgressCard({ request, compact = false }) {
  const total = request?.totalAmount ?? 0;
  const settled = request?.settledAmount ?? 0;
  const remaining = request?.remainingAmount ?? Math.max(total - settled, 0);
  const percent = total > 0 ? Math.min(100, Math.round((settled / total) * 100)) : 0;

  return (
    <Card padding={compact ? "sm" : "md"} hoverable className="refund-card">
      <div className="refund-card__top">
        <div className="refund-card__badges">
          <Badge tone={returnRequestStatusTone(request?.status)}>{request?.status || "—"}</Badge>
          <Badge tone={settlementStatusTone(request?.settlementStatus)}>
            {titleCaseWords(request?.settlementStatus)}
          </Badge>
        </div>
        <p className="refund-card__date">{formatDate(request?.createdAt)}</p>
      </div>

      <p className="refund-card__txn-label">Transaction</p>
      <p className="refund-card__txn-id text-mono">{request?.originalTransaction || "—"}</p>

      <div className="refund-card__amounts">
        <div>
          <p className="refund-card__amount-label">Requested</p>
          <p className="refund-card__amount-value">{formatCurrency(total)}</p>
        </div>
        <div>
          <p className="refund-card__amount-label">Returned</p>
          <p className="refund-card__amount-value refund-card__amount-value--positive">
            {formatCurrency(settled)}
          </p>
        </div>
        <div>
          <p className="refund-card__amount-label">Remaining</p>
          <p className="refund-card__amount-value">{formatCurrency(remaining)}</p>
        </div>
      </div>

      <div className="refund-card__progress-track">
        <div
          className={`refund-card__progress-fill refund-card__progress-fill--${settlementStatusTone(
            request?.settlementStatus
          )}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="refund-card__progress-label">{percent}% returned</p>

      {!compact && request?.reason && <p className="refund-card__reason">“{request.reason}”</p>}
    </Card>
  );
}
