import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

// The layout's generateStaticParams does not propagate to metadata image
// routes; without this the image is rendered on demand per request.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Image metadata. Next injects <meta property="og:image"> / twitter:image
// for every page under this segment from this file convention.
export const alt = "Eugenio Guevara - Full-Stack Developer & Economist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card is language-neutral, so `params.locale` is intentionally unused;
// the route still lives under [locale] so it attaches to /en and /es.
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 96px",
        background: "#141516",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* Subtle top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 8,
          background: "#4a9eff",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 26,
          color: "#9aa0a6",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "#4a9eff",
          }}
        />
        www.eugenioguevara.com
      </div>

      <div style={{ fontSize: 104, lineHeight: 1.05, marginTop: 28 }}>
        Eugenio Guevara
      </div>

      <div
        style={{
          fontSize: 44,
          color: "#e8eaed",
          marginTop: 18,
        }}
      >
        Full-Stack Developer &amp; Economist
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#9aa0a6",
          marginTop: 56,
          gap: 18,
        }}
      >
        AWS Certified · TypeScript · Go · Rust · React Native
      </div>
    </div>,
    { ...size },
  );
}
