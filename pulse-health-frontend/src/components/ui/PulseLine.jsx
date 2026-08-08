export default function PulseLine() {
  return (
    <svg viewBox="0 0 400 80" className="w-full h-20 my-4" preserveAspectRatio="none">
      <path
        d="M0 40 L70 40 L88 40 L98 12 L112 68 L124 40 L145 40 L158 24 L170 40 L400 40"
        fill="none"
        stroke="url(#pulseGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2554E8" stopOpacity="0" />
          <stop offset="45%" stopColor="#2554E8" stopOpacity="1" />
          <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
