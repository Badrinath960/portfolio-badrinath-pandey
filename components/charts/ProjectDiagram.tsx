export function ProjectDiagram({ kind }: { kind: string }) {
  if (kind === "provision")
    return (
      <svg
        viewBox="0 0 480 240"
        className="project-diagram"
        role="img"
        aria-label="Conceptual diagram: sales records connect to a forecasting chart and report"
      >
        <g fill="none" stroke="currentColor">
          <path d="M65 65v115h355" opacity=".4" />
          <path d="M65 125H420M65 85H420" opacity=".15" strokeDasharray="3 8" />
          <path d="m80 160 55-30 55 15 55-60 55 15" strokeWidth="4" />
          <path
            d="m300 100 55-30 55-18"
            strokeWidth="4"
            strokeDasharray="7 8"
          />
        </g>
        <g fill="currentColor">
          {[
            [80, 160],
            [135, 130],
            [190, 145],
            [245, 85],
            [300, 100],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" />
          ))}
        </g>
        <text
          x="80"
          y="210"
          fill="currentColor"
          fontSize="13"
          fontFamily="monospace"
        >
          CSV → FORECAST → REPORT
        </text>
      </svg>
    );
  return (
    <svg
      viewBox="0 0 480 240"
      className="project-diagram"
      role="img"
      aria-label={
        kind === "raktkadi"
          ? "Conceptual diagram: role-based access connects validation with stock and activity reporting"
          : kind === "award-distribution"
            ? "Conceptual diagram: performance inputs connect to award selection"
            : "Conceptual diagram: tasks connect to project allocations"
      }
    >
      <defs>
        <pattern
          id={`grid-${kind}`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 0H0V24"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".10"
          />
        </pattern>
      </defs>
      <rect width="480" height="240" fill={`url(#grid-${kind})`} />
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        <path
          d="M105 120H198M282 120H376M240 80V48H376V82M240 160V192H376V158"
          opacity=".6"
        />
        <rect x="55" y="88" width="66" height="64" rx="12" />
        <rect x="198" y="78" width="84" height="84" rx="16" />
        <rect x="348" y="88" width="65" height="64" rx="12" />
      </g>
      <g fill="currentColor">
        <circle cx="88" cy="111" r="7" />
        <path d="M76 133q12-20 24 0Z" />
        <path
          d="m222 120 12 12 24-26"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <rect x="362" y="122" width="6" height="15" />
        <rect x="375" y="110" width="6" height="27" />
        <rect x="388" y="102" width="6" height="35" />
        <circle cx="376" cy="48" r="4" />
        <circle cx="376" cy="192" r="4" />
      </g>
    </svg>
  );
}
