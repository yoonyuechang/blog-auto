import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "DevPulse";
  const category = searchParams.get("category") || "tech";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#0B0F19",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
          }}
        >
          <div
            style={{
              backgroundColor: "#10B981",
              color: "#000",
              padding: "8px 24px",
              borderRadius: "9999px",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "40px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </div>

          <div
            style={{
              color: "#FFFFFF",
              fontSize: "64px",
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: "1.2",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#10B981",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            DP
          </div>
          <div
            style={{
              color: "#9CA3AF",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            DevPulse
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
