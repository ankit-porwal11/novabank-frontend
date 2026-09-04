import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "var(--radius-lg)",
          background: "var(--gradient-brand)",
          color: "#fff",
        }}
      >
        <Landmark size={26} />
      </span>
      <div>
        <h1 style={{ fontSize: "var(--fs-2xl)", fontWeight: 800, marginBottom: "8px" }}>
          Page not found
        </h1>
        <p className="text-muted" style={{ maxWidth: 360 }}>
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
