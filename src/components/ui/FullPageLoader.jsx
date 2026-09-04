import Spinner from "./Spinner.jsx";

export default function FullPageLoader({ label = "Loading…" }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "var(--color-text-muted)",
      }}
    >
      <Spinner size={28} />
      <p style={{ fontSize: "var(--fs-sm)" }}>{label}</p>
    </div>
  );
}
