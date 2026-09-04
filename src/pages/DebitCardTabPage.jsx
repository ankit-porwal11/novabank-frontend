import { AlertTriangle } from "lucide-react";
import OrderModuleHeader from "../components/order/OrderModuleHeader.jsx";
import DebitCardPreview from "../components/order/DebitCardPreview.jsx";
import ActiveOrderLockCard from "../components/order/ActiveOrderLockCard.jsx";
import Card from "../components/ui/Card.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useCurrentOrders } from "../hooks/useOrders.js";
import { findActiveOrderOfType } from "../components/order/orderFormat.js";
import "../styles/account.css";
import "../styles/order.css";

export default function DebitCardTabPage() {
  const { data: orders, isLoading, isError, error } = useCurrentOrders();
  const activeOrder = findActiveOrderOfType(orders, "DEBIT_CARD");

  return (
    <div className="account-page">
      <OrderModuleHeader title="Debit Card" />

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
            {activeOrder ? <ActiveOrderLockCard order={activeOrder} /> : <DebitCardPreview />}
          </StaggerItem>
        </StaggerGroup>
      )}
    </div>
  );
}
