import BankAiEmblem from "../three/BankAiEmblem.jsx";
import "./WelcomeBanner.css";

export default function WelcomeBanner({ user }) {
  const firstName = (user?.fullName || user?.username || "").split(" ")[0];
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="welcome-banner">
      <div className="welcome-banner__visual" aria-hidden="true">
        <BankAiEmblem />
      </div>
      <div className="welcome-banner__copy">
        <p className="welcome-banner__eyebrow">Welcome back</p>
        <h2 className="welcome-banner__headline">
          Good to see you, {firstName || "there"}.
        </h2>
        {joined && (
          <p className="welcome-banner__meta">NovaBank member since {joined}</p>
        )}
      </div>
    </div>
  );
}
