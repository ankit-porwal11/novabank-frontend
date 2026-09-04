import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import SecuritySettingsCard from "../components/settings/SecuritySettingsCard.jsx";
import LogoutConfirmDialog from "../components/settings/LogoutConfirmDialog.jsx";
import TiltCard from "../components/motion/TiltCard.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import { useUserStore } from "../stores/userStore.js";
import { useLogout } from "../hooks/useLogout.js";

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleConfirmLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setDialogOpen(false);
        navigate("/login", { replace: true });
      },
    });
  }

  return (
    <StaggerGroup className="settings-stack">
      <style>{`
        .settings-stack { display: flex; flex-direction: column; gap: 24px; max-width: 640px; }
      `}</style>

      <StaggerItem>
        <TiltCard maxTilt={2}>
          <Card>
            <CardHeader title="User settings" subtitle="Your basic account information" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <SettingsRow label="Full name" value={user?.fullName} />
              <SettingsRow label="Username" value={`@${user?.username}`} />
              <SettingsRow label="Email" value={user?.email} />
            </div>
          </Card>
        </TiltCard>
      </StaggerItem>

      <StaggerItem>
        <TiltCard maxTilt={2}>
          <SecuritySettingsCard />
        </TiltCard>
      </StaggerItem>

      <StaggerItem>
        <TiltCard maxTilt={2}>
          <Card>
            <CardHeader title="Session" subtitle="Sign out of NovaBank on this device" />
            <Button
              variant="danger"
              leftIcon={<LogOut size={16} />}
              onClick={() => setDialogOpen(true)}
            >
              Sign out
            </Button>
          </Card>
        </TiltCard>
      </StaggerItem>

      <LogoutConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={logoutMutation.isPending}
      />
    </StaggerGroup>
  );
}

function SettingsRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid var(--color-border)",
        fontSize: "var(--fs-sm)",
      }}
    >
      <span className="text-muted">{label}</span>
      <span style={{ fontWeight: 600 }}>{value || "—"}</span>
    </div>
  );
}
