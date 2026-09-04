import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import FullPageLoader from "../components/ui/FullPageLoader.jsx";
import PageTransition from "../components/motion/PageTransition.jsx";

import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import ChangePasswordPage from "../pages/ChangePasswordPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import AccountOverviewPage from "../pages/AccountOverviewPage.jsx";
import AccountDetailsPage from "../pages/AccountDetailsPage.jsx";
import TransactionsPage from "../pages/TransactionsPage.jsx";
import TransferPage from "../pages/TransferPage.jsx";
import TransferSuccessPage from "../pages/TransferSuccessPage.jsx";
import ReturnRequestCreatePage from "../pages/ReturnRequestCreatePage.jsx";
import ReturnRequestsPage from "../pages/ReturnRequestsPage.jsx";
import EligibleReturnTransfersPage from "../pages/EligibleReturnTransfersPage.jsx";
import OrdersOverviewPage from "../pages/OrdersOverviewPage.jsx";
import PassbookOrderPage from "../pages/PassbookOrderPage.jsx";
import ChequeBookOrderPage from "../pages/ChequeBookOrderPage.jsx";
import DebitCardTabPage from "../pages/DebitCardTabPage.jsx";
import DebitCardRequestPage from "../pages/DebitCardRequestPage.jsx";
import OrderHistoryPage from "../pages/OrderHistoryPage.jsx";
import OrderTrackPage from "../pages/OrderTrackPage.jsx";
import AiFormAssistantPage from "../pages/AiFormAssistantPage.jsx";
import MissingFieldsPage from "../pages/MissingFieldsPage.jsx";
import FormPreviewPage from "../pages/FormPreviewPage.jsx";
import EditableUpdateFormPage from "../pages/EditableUpdateFormPage.jsx";

// Lazy-loaded so the landing page's chunk (and, transitively, the
// three.js/@react-three/fiber/gsap chunks it pulls in) is never part of the
// bundle the dashboard or auth pages load. Everything below is unchanged
// route/guard logic from Phase 1 — only wrapped in <PageTransition>, which
// fades+rises each page in on mount. DashboardLayout keeps its own internal
// transition for sub-navigation so the sidebar/topbar never remount when
// moving between Dashboard/Profile/Settings/Security (see DashboardLayout.jsx).
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));

function withTransition(element) {
  return <PageTransition>{element}</PageTransition>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<FullPageLoader label="Loading…" />}>
            {withTransition(<LandingPage />)}
          </Suspense>
        }
      />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={withTransition(<LoginPage />)} />
        <Route path="/register" element={withTransition(<RegisterPage />)} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/security" element={<ChangePasswordPage />} />

          {/* Account module. Phase 2.1: Overview/Details/Transactions.
              Phase 2.2: Transfer + Return Requests, added below as sibling
              routes. Deposit/Withdraw remain out of scope. */}
          <Route path="/account" element={<AccountOverviewPage />} />
          <Route path="/account/details" element={<AccountDetailsPage />} />
          <Route path="/account/transactions" element={<TransactionsPage />} />
          <Route path="/account/transfer" element={<TransferPage />} />
          <Route path="/account/transfer/success" element={<TransferSuccessPage />} />
          <Route path="/account/return-request/new" element={<ReturnRequestCreatePage />} />
          <Route path="/account/return-request/eligible" element={<EligibleReturnTransfersPage />} />
          <Route path="/account/return-requests" element={<ReturnRequestsPage />} />

          {/* Order module. Top tabs per spec: Overview, Cheque Book, Card,
              Passbook, History. Card has two routes: /orders/card (360°
              preview) and /orders/card/request (the actual order form),
              matching the spec's "click card to open Card Request" flow. */}
          <Route path="/orders" element={<OrdersOverviewPage />} />
          <Route path="/orders/passbook" element={<PassbookOrderPage />} />
          <Route path="/orders/cheque-book" element={<ChequeBookOrderPage />} />
          <Route path="/orders/card" element={<DebitCardTabPage />} />
          <Route path="/orders/card/request" element={<DebitCardRequestPage />} />
          <Route path="/orders/history" element={<OrderHistoryPage />} />
          <Route path="/orders/track/:orderId" element={<OrderTrackPage />} />

          {/* AI Form Assistant module. Additive only — see Step 4 report.
              /ai-form-assistant is the permanent chat; the other three are
              temporary workspaces that always return to that same chat. */}
          <Route path="/ai-form-assistant" element={<AiFormAssistantPage />} />
          <Route path="/ai-form-assistant/missing-fields" element={<MissingFieldsPage />} />
          <Route path="/ai-form-assistant/preview" element={<FormPreviewPage />} />
          <Route path="/ai-form-assistant/update" element={<EditableUpdateFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={withTransition(<NotFoundPage />)} />
    </Routes>
  );
}
