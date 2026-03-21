import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get("name") || "Taste of Moselle";
  const score = searchParams.get("score") || "";
  const category = searchParams.get("category") || "";
  const image = searchParams.get("image") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Background */}
        {image ? (
          <img
            src={image}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #4A7C59 0%, #2D5016 100%)",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "60px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Score badge */}
          {score && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background: "#4A7C59",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontSize: "28px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ★ {score}/10
              </div>
              {category && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "999px",
                    fontSize: "22px",
                  }}
                >
                  {category}
                </div>
              )}
            </div>
          )}

          {/* Name */}
          <h1
            style={{
              color: "white",
              fontSize: name.length > 30 ? "52px" : "64px",
              fontWeight: "800",
              lineHeight: 1.1,
              margin: 0,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {name}
          </h1>

          {/* Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "24px" }}>
              Taste of Moselle — Le guide gourmand
            </span>
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
