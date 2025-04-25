import { ImageResponse } from "next/og";
import { cn } from "@/lib/utils";

export const config = {
  runtime: "edge",
};

async function loadGoogleFont(fontName: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontName
  )}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (match) {
    const fontResp = await fetch(match[1]);
    if (fontResp.ok) {
      return fontResp.arrayBuffer();
    }
  }
  throw new Error(`Failed to load font ${fontName}`);
}

export async function GET(_request: Request) {
  const text = "Shqr";

  const fugazData = await loadGoogleFont("Fugaz One", text);

  const ogMarkup = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, hsl(221, 83%, 53%), hsl(252, 64%, 68%))",
        color: "#fff",
        borderRadius: "56px",
        fontFamily: "Fugaz One, sans-serif",
        padding: "20px",
        textAlign: "center",
        lineHeight: ".7",
      }}
    >
      <div style={{ fontSize: "11rem", marginBottom: "-10px" }}>Sh</div>
      <div style={{ fontSize: "12rem", marginTop: "-10px" }}>qr</div>
    </div>
  );

  return new ImageResponse(ogMarkup, {
    width: 300,
    height: 300,
    headers: { "Content-Type": "image/png" },
    fonts: [
      {
        name: "Fugaz One",
        data: fugazData,
        weight: 400,
        style: "normal",
      },
    ],
  });
}
