import { checkedRecords, regionCounts } from "@/lib/demo";

/** Decorative shared geometry; the HTML steps and table are the accessible source. */
export function StoryMorph() {
  return (
    <svg
      viewBox="0 0 460 280"
      className="story-chart story-morph"
      aria-hidden="true"
    >
      {checkedRecords.map((record, i) => (
        <rect
          key={i}
          className="morph-record"
          data-issue={record.issue ?? ""}
          x={25 + ((i * 83) % 390)}
          y={25 + ((i * 47) % 220)}
          width="26"
          height="26"
          rx="4"
          fill="#75e2c0"
        />
      ))}
      <g className="morph-review" opacity="0">
        <path d="M364 16V263" stroke="#f3c77b" strokeDasharray="3 5" />
        <text x="375" y="275" fill="#f3c77b" fontSize="12">
          REVIEW
        </text>
      </g>
      <g
        className="morph-chart-labels"
        opacity="0"
        fill="#f3f6f4"
        fontSize="14"
      >
        {regionCounts.map(({ region, count }, i) => (
          <g key={region}>
            <text x="70" y={70 + i * 70} textAnchor="end">
              {region}
            </text>
            <text x={100 + count * 35} y={70 + i * 70}>
              {count}
            </text>
          </g>
        ))}
        <text x="90" y="265" fontSize="12">
          Valid record count · baseline 0 · total 20
        </text>
      </g>
      <g className="morph-workflow" opacity="0">
        {["Input", "Check", "Review", "Report"].map((label, i) => (
          <g key={label} transform={`translate(${25 + i * 110} 105)`}>
            {i < 3 && <path d="M75 30H110" stroke="#75e2c0" />}
            <rect
              width="75"
              height="60"
              rx="8"
              fill="#1b3342"
              stroke="#75e2c0"
            />
            <text
              x="37.5"
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
    </svg>
  );
}
