import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, AtSign } from "lucide-react";
import Input from "../ui/Input.jsx";
import PasswordInput from "./PasswordInput.jsx";
import FileUploadField from "./FileUploadField.jsx";
import Button from "../ui/Button.jsx";
import MagneticButton from "../motion/MagneticButton.jsx";
import { useRegister } from "../../hooks/useRegister.js";
import {
  validateFullName,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  runValidation,
  hasErrors,
} from "../../lib/validators.js";

const initialValues = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Three visual "steps" reveal in sequence — a single-page form that feels
// like a guided onboarding flow rather than one long block of fields.
const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [values, setValues] = useState(initialValues);
  const [avatar, setAvatar] = useState(null);
  const [coverimage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState({});

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
      username: validateUsername,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (v) => validateConfirmPassword(values.password, v),
    });

    // Avatar is required by the backend (Backend/src/controllers/user.controller.js)
    if (!avatar) {
      validationErrors.avatar = "Profile photo is required";
    }

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    registerMutation.mutate(
      { ...values, avatar, coverimage },
      {
        onSuccess: () => navigate("/login", { replace: true }),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        <motion.div
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          style={{ display: "flex", gap: "16px" }}
        >
          <FileUploadField
            label="Profile photo"
            shape="circle"
            required
            error={errors.avatar}
            onChange={setAvatar}
          />
          <div style={{ flex: 1 }}>
            <FileUploadField
              label="Cover image (optional)"
              shape="banner"
              onChange={setCoverImage}
            />
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: "22px" }}
        >
          <Input
            label="Full name"
            floating
            type="text"
            leftIcon={<User size={16} />}
            value={values.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
            autoComplete="name"
          />

          <Input
            label="Username"
            floating
            type="text"
            leftIcon={<AtSign size={16} />}
            value={values.username}
            onChange={handleChange("username")}
            error={errors.username}
            hint={!errors.username ? "Letters, numbers, and underscores only" : undefined}
            autoComplete="username"
          />

          <Input
            label="Email"
            floating
            type="email"
            leftIcon={<Mail size={16} />}
            value={values.email}
            onChange={handleChange("email")}
            error={errors.email}
            autoComplete="email"
          />
        </motion.div>

        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: "22px" }}
        >
          <PasswordInput
            label="Password"
            floating
            value={values.password}
            onChange={handleChange("password")}
            error={errors.password}
            hint={!errors.password ? "Minimum 8 characters" : undefined}
            autoComplete="new-password"
          />

          <PasswordInput
            label="Confirm password"
            floating
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <MagneticButton strength={10}>
            <Button type="submit" fullWidth isLoading={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account…" : "Create account"}
            </Button>
          </MagneticButton>

          <p
            style={{
              textAlign: "center",
              fontSize: "var(--fs-sm)",
              color: "var(--color-text-muted)",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#93c5fd", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </form>
  );
}
