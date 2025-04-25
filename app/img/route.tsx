import { ImageResponse } from "next/og";
import { cn } from "@/lib/utils";

export const config = {
  runtime: "edge",
};

// same helper from your first snippet
async function loadGoogleFont(fontName: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontName
  )}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  // pull out the first font-file URL
  const match = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );
  if (match) {
    const fontResp = await fetch(match[1]);
    if (fontResp.ok) {
      return fontResp.arrayBuffer();
    }
  }
  throw new Error(`Failed to load font ${fontName}`);
}

export async function GET(
  _request: Request,
) {
  // you can await your inviteId here if you plan to render it into the image


  // the actual text you want to render
  const text = "Sh"; // or derive from inviteId / other logic

  // load the font data at runtime
  const fugazData = await loadGoogleFont("Fugaz One", text);

  // build your OG markup
  const ogMarkup = (
    <div
      className={cn("fugaz-one-regular")}
      style={{
        fontSize: "12rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, hsl(221, 83.2%, 53.3%), hsl(252, 64%, 68%))",
        color: "#fff",
        borderRadius: "56px",
        padding: "15px",
        fontFamily: "Fugaz One, sans-serif",
      }}
    >
      {text}
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
