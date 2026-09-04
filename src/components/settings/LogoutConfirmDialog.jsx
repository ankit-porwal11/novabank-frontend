import { LogOut } from "lucide-react";
import Button from "../ui/Button.jsx";
import "./LogoutConfirmDialog.css";

export default function LogoutConfirmDialog({ open, onConfirm, onCancel, isLoading }) {
  if (!open) return null;

  return (
    <div className="logout-dialog__overlay" role="presentation" onClick={onCancel}>
      <div
        className="logout-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-dialog__icon">
          <LogOut size={20} />
        </div>
        <h3 id="logout-dialog-title" className="logout-dialog__title">
          Sign out of NovaBank?
        </h3>
        <p className="logout-dialog__body">
          You'll need to sign in again to access your account and dashboard.
        </p>
        <div className="logout-dialog__actions">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading} fullWidth>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading} fullWidth>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
