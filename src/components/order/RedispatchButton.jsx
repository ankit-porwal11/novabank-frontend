import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useRedispatchOrder } from "../../hooks/useOrders.js";

/**
 * Spec corner case #2 "Reattempt Button": after click, disable + loading,
 * then "✓ Redispatch Requested", hide original button.
 * Spec corner case #6 "Redispatch Already Done": show "Redispatch already
 * processed." and hide the button.
 */
export default function RedispatchButton({ order }) {
  const { mutate: redispatch, isPending } = useRedispatchOrder();
  const [justRequested, setJustRequested] = useState(false);

  const alreadyRedispatched = order?.redispatchRequested === true || justRequested;

  if (alreadyRedispatched) {
    return (
      <p className="order-action-note order-action-note--success">
        <CheckCircle2 size={15} strokeWidth={2.2} />
        {justRequested ? "Redispatch Requested" : "Redispatch already processed."}
      </p>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      isLoading={isPending}
      disabled={isPending}
      onClick={() => redispatch(order._id, { onSuccess: () => setJustRequested(true) })}
    >
      Reattempt Delivery
    </Button>
  );
}
