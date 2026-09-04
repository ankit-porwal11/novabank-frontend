import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import OrderModuleHeader from "./OrderModuleHeader.jsx";
import AddressForm from "./AddressForm.jsx";
import OrderSuccessNotice from "./OrderSuccessNotice.jsx";
import ActiveOrderLockCard from "./ActiveOrderLockCard.jsx";
import Card from "../ui/Card.jsx";
import Spinner from "../ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../motion/Stagger.jsx";
import { useCurrentOrders } from "../../hooks/useOrders.js";
import { findActiveOrderOfType } from "./orderFormat.js";
import "../../styles/account.css";
import "../../styles/order.css";

/**
 * Spec corner case #8 "URL Manipulation Protection": this page always
 * calls GET /order/current itself (via useCurrentOrders) before rendering
 * the form, regardless of how the user arrived here — direct link, tab
 * click, or a hand-typed URL all go through the exact same guard.
 */
export default function ProductOrderPage({ itemType, title, heading }) {
  const { data: orders, isLoading, isError, error } = useCurrentOrders();
  const [justCreated, setJustCreated] = useState(false);

  const activeOrder = findActiveOrderOfType(orders, itemType);

  return (
    <div className="account-page">
      <OrderModuleHeader title={title} />

      {isLoading ? (
        <div className="account-gate-loading">
          <Spinner size={26} />
          <p>Checking your existing orders…</p>
        </div>
      ) : isError ? (
        <Card padding="lg" className="account-gate-error">
          <AlertTriangle size={22} strokeWidth={2} />
          <p className="account-gate-error__title">Couldn't check your orders</p>
          <p className="account-gate-error__message">
            {error?.response?.data?.message || "Something went wrong. Please try again."}
          </p>
        </Card>
      ) : (
        <StaggerGroup className="account-page">
          <StaggerItem>
            {justCreated ? (
              <OrderSuccessNotice itemType={itemType} />
            ) : activeOrder ? (
              <ActiveOrderLockCard order={activeOrder} />
            ) : (
              <AddressForm itemType={itemType} heading={heading} onSuccess={() => setJustCreated(true)} />
            )}
          </StaggerItem>
        </StaggerGroup>
      )}
    </div>
  );
}
