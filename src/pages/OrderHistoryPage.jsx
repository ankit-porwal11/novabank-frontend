import { AlertTriangle, Inbox } from "lucide-react";
import OrderModuleHeader from "../components/order/OrderModuleHeader.jsx";
import OrderHistoryCard from "../components/order/OrderHistoryCard.jsx";
import Card from "../components/ui/Card.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
// import { useCurrentOrders } from "../hooks/useOrders.js";
import { useOrderHistory } from "../hooks/useOrders.js";
import "../styles/account.css";
import "../styles/order.css";

export default function OrderHistoryPage() {
  // const { data: orders, isLoading, isError, error } = useCurrentOrders();
  const { data: orders, isLoading, isError, error } = useOrderHistory();
  const list = orders || [];

  return (
    <div className="account-page">
      <OrderModuleHeader title="History" subtitle="Complete lifecycle for every order you've placed." />

      {isLoading ? (
        <div className="account-gate-loading">
          <Spinner size={26} />
          <p>Loading your order history…</p>
        </div>
      ) : isError ? (
        <Card padding="lg" className="account-gate-error">
          <AlertTriangle size={22} strokeWidth={2} />
          <p className="account-gate-error__title">Couldn't load order history</p>
          <p className="account-gate-error__message">
            {error?.response?.data?.message || "Something went wrong. Please try again."}
          </p>
        </Card>
      ) : list.length === 0 ? (
        <Card padding="lg" className="order-empty">
          <Inbox size={26} strokeWidth={1.5} />
          <p className="order-empty__title">No orders yet</p>
          <p className="order-empty__subtitle">
            Orders you place for a Passbook, Cheque Book, or Debit Card will show their full
            history here.
          </p>
        </Card>
      ) : (
        <StaggerGroup className="order-history-grid">
          {list.map((order) => (
            <StaggerItem key={order._id}>
              <OrderHistoryCard order={order} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
