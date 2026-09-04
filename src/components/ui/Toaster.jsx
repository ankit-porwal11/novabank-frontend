import { Toaster as HotToaster } from "react-hot-toast";

/**
 * App-wide toast host, styled to match the dark banking theme.
 * Mount once near the root; use `toast.success(...)`, `toast.error(...)` etc.
 * from `react-hot-toast` anywhere (or the wrappers in lib/toast.js).
 */
export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#111827",
          color: "#f8fafc",
          border: "1px solid #1f2937",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "0.875rem",
          fontFamily: "Inter, sans-serif",
          boxShadow: "0 12px 32px rgba(0,0,0,0.36)",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "#0b1020" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#0b1020" },
        },
      }}
    />
  );
}
