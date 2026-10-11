export function SculpturePoster() {
  return (
    <svg
      className="sculpture-poster"
      viewBox="0 0 520 480"
      role="img"
      aria-label="An original sculpture of data blocks aligning into a structured lattice"
    >
      <defs>
        <linearGradient id="block" x2="1" y2="1">
          <stop stopColor="#b6ffe6" />
          <stop offset="1" stopColor="#44b799" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#385363" strokeWidth=".8">
        <path d="M30 365 260 475 500 352M30 305 260 415 500 292M30 245 260 355 500 232M30 185 260 295 500 172" />
        <path d="m60 130 0 250m100-300v350m100-390v420m100-380v340m100-270v220" />
      </g>
      <g transform="translate(254 78)">
        {Array.from({ length: 36 }, (_, i) => {
          const x = ((i % 6) - Math.floor(i / 6)) * 33,
            y = ((i % 6) + Math.floor(i / 6)) * 18;
          const h = 26 + ((i * 7) % 4) * 19;
          return (
            <g key={i} transform={`translate(${x} ${y + 95 - h})`}>
              <path
                d={`M0 0 24 13 0 26 -24 13Z`}
                fill={i % 9 === 0 ? "#f3c77b" : "url(#block)"}
              />
              <path
                d={`M-24 13 0 26 0 ${h + 26} -24 ${h + 13}Z`}
                fill={i % 9 === 0 ? "#ba8b43" : "#246959"}
              />
              <path
                d={`M24 13 0 26 0 ${h + 26} 24 ${h + 13}Z`}
                fill={i % 9 === 0 ? "#ddae62" : "#479a84"}
                stroke="#09141f"
                strokeWidth=".7"
              />
            </g>
          );
        })}
      </g>
      <g fill="#75e2c0">
        {Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            cx={45 + ((i * 97) % 430)}
            cy={50 + ((i * 67) % 340)}
            r={i % 3 === 0 ? 2.5 : 1.5}
            opacity=".65"
          />
        ))}
      </g>
    </svg>
  );
}
