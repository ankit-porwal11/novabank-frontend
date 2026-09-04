import { forwardRef } from "react";
import Spinner from "./Spinner.jsx";
import "./Button.css";

/**
 * Button — shared action primitive.
 * variants: primary | secondary | ghost | danger
 * sizes: sm | md | lg
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    fullWidth = false,
    leftIcon = null,
    rightIcon = null,
    children,
    type = "button",
    className = "",
    ...rest
  },
  ref
) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner size={16} />
          <span>Please wait…</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn__icon">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="btn__icon">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

export default Button;
