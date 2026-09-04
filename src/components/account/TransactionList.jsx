import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowDownUp, Inbox } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import TransactionRow from "./TransactionRow.jsx";
import "./TransactionList.css";

const TYPE_FILTERS = ["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER", "RETURN"];

export default function TransactionList({
  transactions = [],
  compact = false,
  limit,
  title = "Transaction history",
  headerAction,
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortDir, setSortDir] = useState("desc"); // desc = newest first

  const filtered = useMemo(() => {
    let result = transactions;

    if (typeFilter !== "ALL") {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((t) => {
        return (
          t.description?.toLowerCase().includes(q) ||
          t.type?.toLowerCase().includes(q) ||
          t.status?.toLowerCase().includes(q) ||
          t.to?.accountNumber?.toLowerCase().includes(q) ||
          t.from?.accountNumber?.toLowerCase().includes(q)
        );
      });
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    });

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [transactions, query, typeFilter, sortDir, limit]);

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={`${transactions.length} total transaction${transactions.length === 1 ? "" : "s"}`}
        action={headerAction}
      />

      {!compact && (
        <div className="txn-list__controls">
          <Input
            leftIcon={<Search size={16} />}
            placeholder="Search by description, type, status, account…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="txn-list__search"
          />

          <div className="txn-list__filters">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                type="button"
                className={`txn-list__filter-chip ${typeFilter === type ? "txn-list__filter-chip--active" : ""}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === "ALL" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowDownUp size={14} />}
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          >
            {sortDir === "desc" ? "Newest first" : "Oldest first"}
          </Button>
        </div>
      )}

      <div className="txn-list__rows">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="txn-list__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Inbox size={28} strokeWidth={1.5} />
              <p className="txn-list__empty-title">
                {transactions.length === 0 ? "No transactions yet" : "No matching transactions"}
              </p>
              <p className="txn-list__empty-subtitle">
                {transactions.length === 0
                  ? "Activity on your account will show up here."
                  : "Try a different search term or filter."}
              </p>
            </motion.div>
          ) : (
            filtered.map((t, i) => (
              <TransactionRow key={`${t.type}-${t.createdAt}-${i}`} transaction={t} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
