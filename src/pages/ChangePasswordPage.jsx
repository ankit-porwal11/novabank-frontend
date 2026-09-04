import { motion } from "framer-motion";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import ChangePasswordForm from "../components/settings/ChangePasswordForm.jsx";

export default function ChangePasswordPage() {
  return (
    <motion.div
      style={{ maxWidth: 520 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader
          title="Change password"
          subtitle="Choose a strong password you don't use elsewhere"
        />
        <ChangePasswordForm />
      </Card>
    </motion.div>
  );
}
