import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import "./StatsRow.css";

function daysSince(dateString) {
  if (!dateString) return 0;
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function CountUpValue({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function StatsRow({ user }) {
  const memberDays = daysSince(user?.createdAt);

  const stats = [
    {
      icon: ShieldCheck,
      value: 100,
      suffix: "%",
      label: "Account verified",
    },
    {
      icon: Clock,
      value: memberDays,
      suffix: memberDays === 1 ? " day" : " days",
      label: "As a NovaBank member",
    },
    {
      icon: CheckCircle2,
      value: 256,
      suffix: "-bit",
      label: "Session encryption",
    },
  ];

  return (
    <div className="stats-row">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            className="stats-row__card"
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="stats-row__icon">
              <Icon size={16} strokeWidth={2} />
            </span>
            <div>
              <p className="stats-row__value">
                <CountUpValue value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="stats-row__label">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
