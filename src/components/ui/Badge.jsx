import "./Badge.css";

/**
 * Badge — small status/label chip.
 * tone: neutral | primary | success | danger | warning
 */
export default function Badge({ children, tone = "neutral", icon = null, className = "" }) {
  return (
    <span className={`badge badge--${tone} ${className}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
}
