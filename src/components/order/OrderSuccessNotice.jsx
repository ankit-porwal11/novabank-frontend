import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Card from "../ui/Card.jsx";
import "./OrderSuccessNotice.css";

const PRODUCT_TITLE = {
  PASSBOOK: "Passbook",
  CHEQUE_BOOK: "Cheque Book",
  DEBIT_CARD: "Debit Card",
};

/**
 * Exact spec text: "✓ [Product] Ordered Successfully" + the fixed
 * thank-you message, with the product name substituted into the message.
 * No buttons, no actions, per spec.
 */
export default function OrderSuccessNotice({ itemType }) {
  const productTitle = PRODUCT_TITLE[itemType] || "Item";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card padding="lg" className="order-success-notice">
        <motion.span
          className="order-success-notice__icon"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
        >
          <CheckCircle2 size={34} strokeWidth={2} />
        </motion.span>

        <p className="order-success-notice__title">✓ {productTitle} Ordered Successfully</p>
        <p className="order-success-notice__message">
          Thank you for choosing NovaBank. Your {productTitle} request has been submitted
          successfully. Tracking number will be generated within 24 hours and will be sent to
          your registered email address.
        </p>
        <p className="order-success-notice__message">Thank you for banking with NovaBank.</p>
      </Card>
    </motion.div>
  );
}
