import AuthLayout from "../components/layout/AuthLayout.jsx";
import RegisterForm from "../components/auth/RegisterForm.jsx";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up secure access to your NovaBank profile."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
