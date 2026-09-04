import { useUserStore } from "../stores/userStore.js";
import WelcomeBanner from "../components/dashboard/WelcomeBanner.jsx";
import FloatingAccountCard from "../components/dashboard/FloatingAccountCard.jsx";
import SecurityScoreRing from "../components/dashboard/SecurityScoreRing.jsx";
import ActivityPanel from "../components/dashboard/ActivityPanel.jsx";
import ProfileSummaryCard from "../components/dashboard/ProfileSummaryCard.jsx";
import AccountInfoCard from "../components/dashboard/AccountInfoCard.jsx";
import QuickActionsGrid from "../components/dashboard/QuickActionsGrid.jsx";
import StatsRow from "../components/dashboard/StatsRow.jsx";
import TiltCard from "../components/motion/TiltCard.jsx";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger.jsx";
import "./DashboardPage.css";

export default function DashboardPage() {
  const user = useUserStore((s) => s.user);

  return (
    <StaggerGroup className="dashboard-page">
      <StaggerItem>
        <WelcomeBanner user={user} />
      </StaggerItem>

      <StaggerItem>
        <StatsRow user={user} />
      </StaggerItem>

      <div className="dashboard-grid dashboard-grid--top">
        <StaggerItem>
          <TiltCard maxTilt={3} className="dashboard-tilt-card dashboard-tilt-card--xl">
            <FloatingAccountCard user={user} />
          </TiltCard>
        </StaggerItem>
        <StaggerItem>
          <TiltCard maxTilt={3} className="dashboard-tilt-card">
            <ProfileSummaryCard user={user} />
          </TiltCard>
        </StaggerItem>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-grid__stack">
          <StaggerItem>
            <TiltCard maxTilt={2.5} className="dashboard-tilt-card">
              <SecurityScoreRing user={user} />
            </TiltCard>
          </StaggerItem>
          <StaggerItem>
            <TiltCard maxTilt={2.5} className="dashboard-tilt-card">
              <AccountInfoCard user={user} />
            </TiltCard>
          </StaggerItem>
          <StaggerItem>
            <TiltCard maxTilt={2.5} className="dashboard-tilt-card">
              <QuickActionsGrid />
            </TiltCard>
          </StaggerItem>
        </div>
        <StaggerItem>
          <TiltCard maxTilt={2.5} className="dashboard-tilt-card">
            <ActivityPanel user={user} />
          </TiltCard>
        </StaggerItem>
      </div>
    </StaggerGroup>
  );
}
