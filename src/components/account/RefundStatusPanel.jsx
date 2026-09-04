import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import Spinner from "../ui/Spinner.jsx";
import RefundProgressCard from "./RefundProgressCard.jsx";
import { useMyReturnRequests } from "../../hooks/useMyReturnRequests.js";
import { formatCurrency } from "./accountFormat.js";
import "./RefundStatusPanel.css";

/**
 * Overview's "Refund Tracking" section. Pulls the same
 * ['returnRequests','mine'] query used by the Return Requests page (shared
 * cache, no duplicate network call if that page was already visited this
 * session) and shows the two most recent requests plus a real, computed
 * (not fabricated) total-outstanding figure.
 *
 * Note: GET /account/return-request/my-requests currently only returns
 * requests where the signed-in user is the approver, not ones they
 * created as sender — see the doc comment on getMyReturnRequests in
 * src/api/account.api.js for why. This panel just renders whatever the
 * endpoint actually returns.
 */
export default function RefundStatusPanel() {
  const { data: requests, isLoading, isError } = useMyReturnRequests();

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Refund tracking" subtitle="Return requests on your account" />
        <div className="refund-panel__loading">
          <Spinner size={22} />
        </div>
      </Card>
    );
  }

  if (isError) {
    return null;
  }

  const list = requests || [];
  const outstanding = list.filter((r) => (r.remainingAmount ?? 0) > 0);
  const totalOutstanding = outstanding.reduce((sum, r) => sum + (r.remainingAmount || 0), 0);
  const recent = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <Card>
      <CardHeader
        title="Refund tracking"
        subtitle={
          list.length === 0
            ? "No return requests on your account"
            : outstanding.length > 0
            ? `${formatCurrency(totalOutstanding)} still pending across ${outstanding.length} request${
                outstanding.length === 1 ? "" : "s"
              }`
            : "All return requests are fully settled"
        }
        action={
          list.length > 0 && (
            <Link to="/account/return-requests" className="btn btn--secondary btn--sm">
              View all
            </Link>
          )
        }
      />

      {list.length === 0 ? (
        <div className="refund-panel__empty">
          <Inbox size={22} strokeWidth={1.5} />
          <p>Refund activity on your account will show up here.</p>
        </div>
      ) : (
        <div className="refund-panel__list">
          {recent.map((request) => (
            <RefundProgressCard key={request._id} request={request} compact />
          ))}
        </div>
      )}
    </Card>
  );
}
