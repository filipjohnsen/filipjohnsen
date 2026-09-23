"use client";

import { m } from "motion/react";
import { rng } from "@/lib/rng";
import type { BrickColor } from "@/content/projects";
import { brickColor } from "./hero/bricks";

const FOUR = ["X.X", "X.X", "XXX", "..X", "..X"];
const ZERO = ["XXX", "X.X", "X.X", "X.X", "XXX"];
const COLS = 11;
const ROWS = 5;
const colors: BrickColor[] = ["ink", "ink", "cobalt", "teal", "tomato", "ink", "mustard"];

const cells = [FOUR, ZERO, FOUR].flatMap((digit, d) =>
  digit.flatMap((row, y) =>
    [...row].flatMap((c, x) => (c === "X" ? [{ x: d * 4 + x, y }] : [])),
  ),
);

const rand = rng("siden falt fra hverandre");
const blocks = cells.map((cell, i) => ({
  ...cell,
  color: colors[i % colors.length],
  // Offsets in multiples of the block's own size, so they work at any width.
  dx: (rand() - 0.5) * 1.6,
  dy: ROWS + 1 - cell.y - rand() * 1.2 - (cell.x % 3 === 1 ? 0.8 : 0),
  rotate: (rand() - 0.5) * 70,
  delay: 0.6 + rand() * 0.5 + (ROWS - cell.y) * 0.04,
}));

/** "404" built from blocks that falls apart shortly after the page loads. */
export function FallenBlocks() {
  return (
    <div className="relative mx-auto aspect-[11/7] w-full max-w-[520px]" aria-hidden="true">
      {blocks.map((b, i) => (
        <m.div
          key={i}
          className="absolute p-[0.5%]"
          style={{
            left: `${(b.x / COLS) * 100}%`,
            top: `${(b.y / 7) * 100}%`,
            width: `${100 / COLS}%`,
            height: `${100 / 7}%`,
          }}
          initial={{ x: "0%", y: "0%", rotate: 0 }}
          animate={{ x: `${b.dx * 100}%`, y: `${b.dy * 100}%`, rotate: b.rotate }}
          transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.8, delay: b.delay }}
        >
          <div
            className="h-full w-full rounded-[14%] shadow-[inset_0_-4px_0_rgb(0_0_0/0.22)]"
            style={{ background: brickColor(b.color) }}
          />
        </m.div>
      ))}
    </div>
  );
}
