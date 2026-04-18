export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NTE Guide"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="logo-glow" x1="20" y1="6" x2="20" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* Outer broken ring */}
      <path
        d="M 20 4 A 16 16 0 1 1 11.1 7.6"
        stroke="url(#logo-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner counter-rotated broken ring */}
      <path
        d="M 24.5 10.5 A 9 9 0 1 0 29 18"
        stroke="url(#logo-glow)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center anomaly spark */}
      <circle cx="20" cy="20" r="3" fill="#818cf8" />
      <circle cx="20" cy="20" r="1.5" fill="#c7d2fe" />
    </svg>
  );
}
