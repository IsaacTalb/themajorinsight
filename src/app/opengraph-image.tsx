import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — intelligence for a world in motion`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f5f3ee", color: "#171714", padding: "72px", fontFamily: "serif" }}>
    <div style={{ display: "flex", fontSize: 28, letterSpacing: 5, textTransform: "uppercase" }}>{siteConfig.name}</div>
    <div style={{ display: "flex", maxWidth: 950, fontSize: 76, lineHeight: 1.05 }}>Intelligence for a world in motion.</div>
    <div style={{ display: "flex", width: "100%", borderTop: "3px solid #171714", paddingTop: 22, fontFamily: "sans-serif", fontSize: 24 }}>Finance · Technology · Science · Culture</div>
  </div>, size);
}
