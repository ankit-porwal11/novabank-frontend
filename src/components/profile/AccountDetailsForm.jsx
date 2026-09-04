import { useState, useEffect } from "react";
import { User, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { CardHeader } from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import TiltCard from "../motion/TiltCard.jsx";
import { useUpdateAccount } from "../../hooks/useUpdateAccount.js";
import { validateFullName, validateEmail, runValidation, hasErrors } from "../../lib/validators.js";

export default function AccountDetailsForm({ user }) {
  const [values, setValues] = useState({ fullName: "", email: "" });
  const [errors, setErrors] = useState({});
  const updateAccountMutation = useUpdateAccount();

  useEffect(() => {
    if (user) {
      setValues({ fullName: user.fullName || "", email: user.email || "" });
    }
  }, [user]);

  const isUnchanged =
    values.fullName === (user?.fullName || "") && values.email === (user?.email || "");

  function handleChange(field) {
    return (e) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = runValidation(values, {
      fullName: validateFullName,
      email: validateEmail,
    });

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    updateAccountMutation.mutate(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard maxTilt={2.5} className="profile-detail-card">
        <Card padding="lg">
          <CardHeader
            title="Account details"
            subtitle="Update the name and email associated with your account"
          />
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <Input
                label="Full name"
                floating
                leftIcon={<User size={16} />}
                value={values.fullName}
                onChange={handleChange("fullName")}
                error={errors.fullName}
              />
              <Input
                label="Email"
                floating
                type="email"
                leftIcon={<Mail size={16} />}
                value={values.email}
                onChange={handleChange("email")}
                error={errors.email}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingTop: "4px" }}>
                <Button
                  type="submit"
                  isLoading={updateAccountMutation.isPending}
                  disabled={isUnchanged}
                >
                  Save changes
                </Button>
                <AnimatePresence>
                  {updateAccountMutation.isSuccess && isUnchanged && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--color-success)",
                        fontSize: "var(--fs-sm)",
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Saved
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </Card>
      </TiltCard>
    </motion.div>
  );
}
