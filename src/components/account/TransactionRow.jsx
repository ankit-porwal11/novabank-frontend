import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import Badge from "../ui/Badge.jsx";
import "./TransactionRow.css";

const TYPE_META = {
  DEPOSIT: { icon: ArrowDownLeft, label: "Deposit" },
  WITHDRAW: { icon: ArrowUpRight, label: "Withdraw" },
  TRANSFER: { icon: ArrowUpRight, label: "Transfer" },
  RETURN: { icon: RotateCcw, label: "Return" },
};

const STATUS_TONE = {
  SUCCESS: "success",
  PENDING: "warning",
  FAILED: "danger",
  REVERSED: "neutral",
};

function formatAmount(amount, direction) {
  if (amount === undefined || amount === null) return "—";
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
  return direction === "DEBIT" ? `− ${formatted}` : `+ ${formatted}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionRow({ transaction, index }) {
  const meta = TYPE_META[transaction.type] || { icon: ArrowUpRight, label: transaction.type || "Transaction" };
  const Icon = meta.icon;
  const isCredit = transaction.direction === "CREDIT";

  return (
    <motion.div
      className="txn-row"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <span className={`txn-row__icon ${isCredit ? "txn-row__icon--credit" : "txn-row__icon--debit"}`}>
        <Icon size={16} strokeWidth={2.1} />
      </span>

      <div className="txn-row__main">
        <p className="txn-row__title">{transaction.description || meta.label}</p>
        <p className="txn-row__meta">
          <span className="text-mono">{transaction.id || transaction._id || "—"}</span>
          <span aria-hidden="true"> · </span>
          {meta.label}
          {transaction.type === "TRANSFER" && transaction.to?.accountNumber && (
            <>
              <span aria-hidden="true"> · </span>
              To {transaction.to.accountNumber}
            </>
          )}
          {transaction.type === "TRANSFER" && transaction.from?.accountNumber && (
            <>
              <span aria-hidden="true"> · </span>
              From {transaction.from.accountNumber}
            </>
          )}
        </p>
      </div>

      <p className="txn-row__date">{formatDate(transaction.createdAt)}</p>

      <Badge tone={STATUS_TONE[transaction.status] || "neutral"}>{transaction.status || "—"}</Badge>

      <p className={`txn-row__amount ${isCredit ? "txn-row__amount--credit" : "txn-row__amount--debit"}`}>
        {formatAmount(transaction.amount, transaction.direction)}
      </p>
    </motion.div>
  );
}
