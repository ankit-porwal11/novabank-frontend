/**
 * Spinner — minimal rotating ring, used inline in buttons and full-page loaders.
 */
export default function Spinner({ size = 20, strokeWidth = 2.5, className = "" }) {
  return (
    <svg
      className={`spinner ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <style>{`
        .spinner { animation: spinner-rotate 0.8s linear infinite; }
        @keyframes spinner-rotate { to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}
