import { ImageResponse } from "next/og";
import { BRICKS, WORD } from "@/components/hero/bricks";

export const alt = "Filip Johnsen – frontendutvikler i Oslo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  ink: "#16161d",
  tomato: "#e4572e",
  cobalt: "#2b4fd8",
  teal: "#16867c",
  mustard: "#e6b43f",
};

export default function OpengraphImage() {
  const u = 56;
  const left = (size.width - WORD.cols * u) / 2;
  const top = 120;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f3efe6", position: "relative" }}>
        {BRICKS.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: left + b.x * u + 2,
              top: top + b.y * u + 2,
              width: b.w * u - 4,
              height: b.h * u - 4,
              borderRadius: 7,
              background: colors[b.color],
              boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.22)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 90,
            display: "flex",
            justifyContent: "center",
            fontSize: 40,
            color: "#16161d",
          }}
        >
          Filip Johnsen · frontendutvikler i Oslo
        </div>
      </div>
    ),
    size,
  );
}
