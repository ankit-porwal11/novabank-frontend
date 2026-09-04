import { forwardRef, useId, useState } from "react";
import { motion } from "framer-motion";
import "./Input.css";

/**
 * Input — labeled text field with error state and optional adornments.
 *
 * `floating` (opt-in, default false) switches to a floating-label layout
 * where the label sits inside the field until focus/value, then animates
 * up. Default behavior (label above the field) is unchanged for every
 * existing call site that doesn't pass this prop.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon = null,
    rightAdornment = null,
    id,
    className = "",
    floating = false,
    onFocus,
    onBlur,
    value,
    defaultValue,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);

  const hasValue =
    value !== undefined && value !== null
      ? String(value).length > 0
      : !!defaultValue;
  const isFloatingUp = floating && (isFocused || hasValue);

  function handleFocus(e) {
    setIsFocused(true);
    onFocus?.(e);
  }
  function handleBlur(e) {
    setIsFocused(false);
    onBlur?.(e);
  }

  return (
    <div className={`field ${className}`}>
      {label && !floating && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      <div
        className={`field__control ${error ? "field__control--error" : ""} ${
          floating ? "field__control--floating" : ""
        } ${isFocused ? "field__control--focused" : ""}`}
      >
        {leftIcon && <span className="field__icon">{leftIcon}</span>}
        {label && floating && (
          <motion.label
            htmlFor={inputId}
            className="field__floating-label"
            animate={
              isFloatingUp
                ? { y: -21, scale: 0.82, color: "var(--color-primary)" }
                : { y: 0, scale: 1, color: "var(--color-text-faint)" }
            }
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: leftIcon ? 40 : 16 }}
          >
            {label}
          </motion.label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`field__input ${floating ? "field__input--floating" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={floating ? "" : rest.placeholder}
          {...rest}
        />
        {rightAdornment && <span className="field__adornment">{rightAdornment}</span>}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="field__message field__message--error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="field__message">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
