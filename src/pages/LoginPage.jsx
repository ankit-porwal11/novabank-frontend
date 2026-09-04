import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import LoginForm from "../components/auth/LoginForm.jsx";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Sign in to NovaBank"
      subtitle="Enter your credentials to access your account."
    >
      <LoginForm onSuccess={() => navigate("/dashboard", { replace: true })} />
    </AuthLayout>
  );
}
