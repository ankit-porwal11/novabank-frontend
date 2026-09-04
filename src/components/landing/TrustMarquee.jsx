import { ShieldCheck, Lock, FileCheck2, Radar } from "lucide-react";
import "./TrustMarquee.css";

const TRUST_ITEMS = [
  { icon: Lock, label: "256-bit encrypted sessions" },
  { icon: ShieldCheck, label: "JWT-secured authentication" },
  { icon: FileCheck2, label: "Verified account onboarding" },
  { icon: Radar, label: "Real-time order tracking" },
];

// Doubled for a seamless CSS-only marquee loop.
const LOOP_ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS];

export default function TrustMarquee() {
  return (
    <div className="trust-marquee" role="presentation">
      <div className="trust-marquee__track">
        {LOOP_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <span className="trust-marquee__item" key={`${item.label}-${i}`}>
              <Icon size={15} strokeWidth={2.25} />
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
