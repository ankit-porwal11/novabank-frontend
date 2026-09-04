import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useAcceptOrder } from "../../hooks/useOrders.js";

/**
 * Spec corner case #1 "Accept Order Button": after first click, disable +
 * show loading, then replace with "✓ Order Accepted" — no second click
 * allowed.
 * Spec corner case #5 "Already Accepted Order": if the order is already
 * past acceptance (customerAccepted true, or a status where accepting no
 * longer applies), show "Order already accepted." with no button at all.
 */
export default function AcceptOrderButton({ order }) {
  const { mutate: acceptOrder, isPending } = useAcceptOrder();
  const [justAccepted, setJustAccepted] = useState(false);

  const alreadyAccepted = order?.customerAccepted === true || justAccepted;

  if (alreadyAccepted) {
    return (
      <p className="order-action-note order-action-note--success">
        <CheckCircle2 size={15} strokeWidth={2.2} />
        {justAccepted ? "Order Accepted" : "Order already accepted."}
      </p>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      isLoading={isPending}
      disabled={isPending}
      onClick={() => acceptOrder(order._id, { onSuccess: () => setJustAccepted(true) })}
    >
      Accept Order
    </Button>
  );
}
