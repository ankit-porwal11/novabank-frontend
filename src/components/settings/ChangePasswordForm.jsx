import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordInput from "../auth/PasswordInput.jsx";
import Button from "../ui/Button.jsx";
import PasswordStrengthMeter from "./PasswordStrengthMeter.jsx";
import SecureLockAnimation from "./SecureLockAnimation.jsx";
import SuccessCheck from "../ui/SuccessCheck.jsx";
import { useChangePassword } from "../../hooks/useChangePassword.js";
import { validatePassword, validateConfirmPassword, runValidation, hasErrors } from "../../lib/validators.js";

const initialValues = { oldPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [justSucceeded, setJustSucceeded] = useState(false);
  const changePasswordMutation = useChangePassword();

  function handleChange(field) {
    return (e) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
      if (justSucceeded) setJustSucceeded(false);
    };
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = runValidation(values, {
      oldPassword: (v) => (!v ? "Current password is required" : ""),
      newPassword: validatePassword,
      confirmPassword: (v) => validateConfirmPassword(values.newPassword, v),
    });

    if (values.newPassword && values.oldPassword && values.newPassword === values.oldPassword) {
      validationErrors.newPassword = "New password must be different from the current one";
    }

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        setValues(initialValues);
        setJustSucceeded(true);
        setTimeout(() => setJustSucceeded(false), 2600);
      },
    });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <SecureLockAnimation locked={justSucceeded} />
      </div>

      <AnimatePresence mode="wait">
        {justSucceeded ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "8px 0 4px" }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <SuccessCheck size={32} />
            </div>
            <p style={{ fontWeight: 700, fontSize: "var(--fs-md)" }}>Password updated</p>
            <p className="text-muted" style={{ fontSize: "var(--fs-sm)", marginTop: 4 }}>
              Your account is now secured with your new password.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <PasswordInput
                label="Current password"
                placeholder="Enter your current password"
                value={values.oldPassword}
                onChange={handleChange("oldPassword")}
                error={errors.oldPassword}
                autoComplete="current-password"
              />
              <div>
                <PasswordInput
                  label="New password"
                  placeholder="Minimum 8 characters"
                  value={values.newPassword}
                  onChange={handleChange("newPassword")}
                  error={errors.newPassword}
                  autoComplete="new-password"
                />
                <div style={{ marginTop: 10 }}>
                  <PasswordStrengthMeter password={values.newPassword} />
                </div>
              </div>
              <PasswordInput
                label="Confirm new password"
                placeholder="Re-enter your new password"
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
              <div>
                <Button type="submit" isLoading={changePasswordMutation.isPending}>
                  Update password
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
