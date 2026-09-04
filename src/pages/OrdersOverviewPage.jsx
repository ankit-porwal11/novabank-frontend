import { AlertTriangle, Inbox } from "lucide-react";
import OrderModuleHeader from "../components/order/OrderModuleHeader.jsx";
import OrderSummaryCard from "../components/order/OrderSummaryCard.jsx";
import ActiveOrderCard from "../components/order/ActiveOrderCard.jsx";
import Card from "../components/ui/Card.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useCurrentOrders } from "../hooks/useOrders.js";
import { useOrderHistory } from "../hooks/useOrders.js";
import { isActiveOrderStatus } from "../components/order/orderFormat.js";
import "../styles/account.css";
import "../styles/order.css";

export default function OrdersOverviewPage() {
  // const { data: orders, isLoading, isError, error } = useCurrentOrders();
     const { data: orders , isLoading, isError, error } = useOrderHistory();

  const list = orders || [];
  const activeOrders = list.filter((o) => isActiveOrderStatus(o.status));

  return (
    <div className="account-page">
      <OrderModuleHeader title="Orders" subtitle="Order and track your Passbook, Cheque Book, and Debit Card." />

      {isLoading ? (
        <div className="account-gate-loading">
          <Spinner size={26} />
          <p>Loading your orders…</p>
        </div>
      ) : isError ? (
        <Card padding="lg" className="account-gate-error">
          <AlertTriangle size={22} strokeWidth={2} />
          <p className="account-gate-error__title">Couldn't load your orders</p>
          <p className="account-gate-error__message">
            {error?.response?.data?.message || "Something went wrong. Please try again."}
          </p>
        </Card>
      ) : (
        <StaggerGroup className="account-page">
          <StaggerItem>
            <OrderSummaryCard orders={list} />
          </StaggerItem>

          <div>
            <p className="account-section-label">Current active orders</p>
            {activeOrders.length === 0 ? (
              <StaggerItem>
                <Card padding="lg" className="order-empty">
                  <Inbox size={26} strokeWidth={1.5} />
                  <p className="order-empty__title">No active orders</p>
                  <p className="order-empty__subtitle">
                    Request a Passbook, Cheque Book, or Debit Card from the tabs above.
                  </p>
                </Card>
              </StaggerItem>
            ) : (
              <div className="order-active-list">
                {activeOrders.map((order) => (
                  <StaggerItem key={order._id}>
                    <ActiveOrderCard order={order} />
                  </StaggerItem>
                ))}
              </div>
            )}
          </div>
        </StaggerGroup>
      )}
    </div>
  );
}
