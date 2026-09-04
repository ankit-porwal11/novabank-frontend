import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Input from "../ui/Input.jsx";
import PasswordInput from "./PasswordInput.jsx";
import Button from "../ui/Button.jsx";
import MagneticButton from "../motion/MagneticButton.jsx";
import { useLogin } from "../../hooks/useLogin.js";
import { runValidation, hasErrors } from "../../lib/validators.js";

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function LoginForm({ onSuccess }) {
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const loginMutation = useLogin();

  function handleChange(field) {
    return (e) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = runValidation(values, {
      identifier: (v) => (!v || !v.trim() ? "Email or username is required" : ""),
      password: (v) => (!v ? "Password is required" : ""),
    });

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <Input
            label="Email or username"
            floating
            type="text"
            leftIcon={<Mail size={16} />}
            value={values.identifier}
            onChange={handleChange("identifier")}
            error={errors.identifier}
            autoComplete="username"
          />
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <PasswordInput
            label="Password"
            floating
            value={values.password}
            onChange={handleChange("password")}
            error={errors.password}
            autoComplete="current-password"
          />
        </motion.div>

        <motion.div
          variants={fieldVariants}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "var(--fs-sm)",
              color: "var(--color-text-muted)",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "var(--color-primary)" }}
            />
            Remember me
          </label>
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <MagneticButton strength={10}>
            <Button type="submit" fullWidth isLoading={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </MagneticButton>
        </motion.div>

        <motion.p
          variants={fieldVariants}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            fontSize: "var(--fs-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "#93c5fd", fontWeight: 600 }}>
            Create one
          </Link>
        </motion.p>
      </div>
    </motion.form>
  );
}
