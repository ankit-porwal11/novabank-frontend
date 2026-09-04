import { useUserStore } from "../stores/userStore.js";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import AccountDetailsForm from "../components/profile/AccountDetailsForm.jsx";

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);

  return (
    <div>
      <ProfileHeader user={user} />
      <div style={{ maxWidth: 560 }}>
        <AccountDetailsForm user={user} />
      </div>
    </div>
  );
}
