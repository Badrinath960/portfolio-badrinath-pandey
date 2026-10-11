import { regionCounts } from "@/lib/demo";
export function StoryChart({ stage = 2 }: { stage?: number }) {
  return (
    <svg
      viewBox="0 0 460 280"
      className="story-chart"
      role="img"
      aria-label={
        stage === 0
          ? "24 sample records before validation"
          : stage === 1
            ? "Four flagged records separate from twenty valid records"
            : stage === 2
              ? "Valid record count: North seven, South six, West seven"
              : "Workflow connects input, check, review and report"
      }
    >
      {stage < 2 ? (
        <g>
          {Array.from({ length: 24 }, (_, i) => {
            const flagged = [6, 12, 14, 19].includes(i);
            return (
              <g
                key={i}
                transform={`translate(${48 + (i % 6) * 67} ${38 + Math.floor(i / 6) * 60})`}
              >
                <rect
                  className="record-cell"
                  width="43"
                  height="36"
                  rx="6"
                  fill={stage === 1 && flagged ? "#f3c77b" : "#75e2c0"}
                  opacity={stage === 1 && flagged ? 1 : 0.7}
                />
                <text
                  x="21"
                  y="23"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#08231b"
                >
                  {stage === 1 && flagged
                    ? "!"
                    : String(i + 1).padStart(2, "0")}
                </text>
              </g>
            );
          })}
        </g>
      ) : stage === 2 ? (
        <g>
          {regionCounts.map(({ region, count }, i) => (
            <g key={region} transform={`translate(85 ${45 + i * 70})`}>
              <text
                x="-15"
                y="25"
                textAnchor="end"
                fill="currentColor"
                fontSize="14"
              >
                {region}
              </text>
              <rect
                className="chart-bar"
                width={count * 36}
                height="38"
                rx="3"
                fill="#75e2c0"
              />
              <text
                x={count * 36 + 12}
                y="25"
                fill="currentColor"
                fontSize="15"
              >
                {count}
              </text>
            </g>
          ))}
          <text x="85" y="270" fill="currentColor" fontSize="12">
            Valid records (count) · baseline 0 · total 20
          </text>
        </g>
      ) : (
        <g>
          {["Input", "Check", "Review", "Report"].map((label, i) => (
            <g key={label} transform={`translate(${30 + i * 110} 100)`}>
              {i < 3 && <path d="M70 30H110" stroke="#75e2c0" />}
              <rect
                width="70"
                height="60"
                rx="10"
                fill="#1b3342"
                stroke="#75e2c0"
              />
              <text
                x="35"
                y="35"
                textAnchor="middle"
                fill="#f3f6f4"
                fontSize="12"
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
