import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Landmark, Sparkles } from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { useCreateAccount } from "../../hooks/useCreateAccount.js";
import "./AccountEmptyState.css";

export default function AccountEmptyState() {
  const navigate = useNavigate();
  const { mutate: createAccount, isPending } = useCreateAccount();

  function handleCreate() {
    createAccount(undefined, {
      onSuccess: () => navigate("/account/details", { replace: true }),
    });
  }

  return (
    <Card padding="lg" className="account-empty">
      <motion.div
        className="account-empty__badge"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.04, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <Landmark size={40} strokeWidth={1.5} />
      </motion.div>

      <h2 className="account-empty__title">No bank account found</h2>
      <p className="account-empty__subtitle">
        You're signed in, but there's no NovaBank account linked to this profile yet.
        Create one to see your balance, account number, and transaction history here.
      </p>

      <Button
        variant="primary"
        size="lg"
        isLoading={isPending}
        onClick={handleCreate}
        leftIcon={<Sparkles size={16} strokeWidth={2.25} />}
      >
        Create Account
      </Button>
    </Card>
  );
}
