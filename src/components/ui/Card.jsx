import "./Card.css";

/**
 * Card — base surface used throughout the dashboard.
 * padding: sm | md | lg | none
 */
export default function Card({
  children,
  padding = "md",
  hoverable = false,
  className = "",
  as: Tag = "div",
  ...rest
}) {
  const classes = [
    "card",
    `card--pad-${padding}`,
    hoverable ? "card--hoverable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`card-header ${className}`}>
      <div className="card-header__text">
        <h3 className="card-header__title">{title}</h3>
        {subtitle && <p className="card-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="card-header__action">{action}</div>}
    </div>
  );
}
