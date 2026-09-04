import { motion } from "framer-motion";
import { UserPlus, RefreshCw, ShieldCheck } from "lucide-react";
import Card, { CardHeader } from "../ui/Card.jsx";
import "./ActivityPanel.css";

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Built only from real, available account facts — createdAt, updatedAt,
 * and the current live session. Phase 1 has no transaction/order API, so
 * this deliberately does not simulate transaction history; that would be
 * fabricated data in a banking product, which we don't do.
 */
export default function ActivityPanel({ user }) {
  const createdLabel = formatDate(user?.createdAt);
  const updatedLabel = formatDate(user?.updatedAt);
  const profileChanged = user?.updatedAt && user?.updatedAt !== user?.createdAt;

  const events = [
    {
      icon: ShieldCheck,
      title: "Signed in",
      detail: "Current session, this device",
      time: "Now",
      live: true,
    },
    ...(profileChanged
      ? [
          {
            icon: RefreshCw,
            title: "Profile updated",
            detail: "Account details or photos changed",
            time: updatedLabel,
          },
        ]
      : []),
    {
      icon: UserPlus,
      title: "Account created",
      detail: "Welcome to NovaBank",
      time: createdLabel,
    },
  ];

  return (
    <Card>
      <CardHeader title="Account activity" subtitle="Recent events on your account" />
      <div className="activity-panel">
        <div className="activity-panel__line" aria-hidden="true" />
        {events.map((event, i) => {
          const Icon = event.icon;
          return (
            <motion.div
              className="activity-panel__row"
              key={event.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.35, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 3 }}
            >
              <span
                className={`activity-panel__icon ${event.live ? "activity-panel__icon--live" : ""}`}
              >
                {event.live && <span className="activity-panel__pulse" />}
                <Icon size={14} strokeWidth={2.25} />
              </span>
              <div className="activity-panel__content">
                <div className="activity-panel__row-top">
                  <span className="activity-panel__title">{event.title}</span>
                  <span className="activity-panel__time text-mono">{event.time}</span>
                </div>
                <p className="activity-panel__detail">{event.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
