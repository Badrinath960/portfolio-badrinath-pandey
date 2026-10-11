import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export const alt = "Badrinath Pandey — From Data to Decision";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09141f",
          color: "#f3f6f4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#75e2c0",
          }}
        >
          <span>BADRINATH PANDEY</span>
          <span>FROM DATA TO DECISION</span>
        </div>
        <div
          style={{
            fontSize: 84,
            lineHeight: 1.05,
            marginTop: 72,
            maxWidth: 940,
          }}
        >
          Turning complex data into clear decisions.
        </div>
        <div style={{ fontSize: 26, color: "#b6c7cf", marginTop: 48 }}>
          Data Operations Analyst · NielsenIQ · Vadodara, India
        </div>
      </div>
    ),
    size,
  );
}
