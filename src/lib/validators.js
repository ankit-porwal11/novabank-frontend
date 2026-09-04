/**
 * Validation rules mirrored exactly from Backend/src/controllers/user.controller.js
 * so the frontend never contradicts the server, and users see errors before
 * a network round-trip.
 */

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function required(value, fieldLabel) {
  if (!value || value.toString().trim() === "") {
    return `${fieldLabel} is required`;
  }
  return "";
}

export function validateEmail(value) {
  if (!value || value.trim() === "") return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
  return "";
}

export function validateUsername(value) {
  if (!value || value.trim() === "") return "Username is required";
  if (!USERNAME_REGEX.test(value)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return "";
}

export function validateFullName(value) {
  if (!value || value.trim() === "") return "Full name is required";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}

/**
 * Runs a map of { field: validatorFn } against a values object.
 * Returns an errors object containing only non-empty messages.
 */
export function runValidation(values, validatorMap) {
  const errors = {};
  for (const [field, validatorFn] of Object.entries(validatorMap)) {
    const message = validatorFn(values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
