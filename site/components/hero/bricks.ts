import type { BrickColor } from "@/content/projects";

export type BrickSpec = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: BrickColor;
};

/** The word FILIP on a 15×5 grid, split into pieces. */
export const WORD = { cols: 15, rows: 5 } as const;

export const BRICKS: BrickSpec[] = [
  // F
  { x: 0, y: 0, w: 2, h: 1, color: "ink" },
  { x: 2, y: 0, w: 1, h: 1, color: "tomato" },
  { x: 0, y: 1, w: 1, h: 2, color: "cobalt" },
  { x: 1, y: 2, w: 2, h: 1, color: "ink" },
  { x: 0, y: 3, w: 1, h: 1, color: "teal" },
  { x: 0, y: 4, w: 1, h: 1, color: "ink" },
  // I
  { x: 4, y: 0, w: 1, h: 1, color: "mustard" },
  { x: 4, y: 1, w: 1, h: 3, color: "ink" },
  { x: 4, y: 4, w: 1, h: 1, color: "cobalt" },
  // L
  { x: 6, y: 0, w: 1, h: 2, color: "teal" },
  { x: 6, y: 2, w: 1, h: 2, color: "ink" },
  { x: 6, y: 4, w: 2, h: 1, color: "ink" },
  { x: 8, y: 4, w: 1, h: 1, color: "tomato" },
  // I
  { x: 10, y: 0, w: 1, h: 2, color: "ink" },
  { x: 10, y: 2, w: 1, h: 1, color: "teal" },
  { x: 10, y: 3, w: 1, h: 2, color: "cobalt" },
  // P
  { x: 12, y: 0, w: 2, h: 1, color: "ink" },
  { x: 14, y: 0, w: 1, h: 2, color: "tomato" },
  { x: 12, y: 1, w: 1, h: 2, color: "cobalt" },
  { x: 13, y: 2, w: 2, h: 1, color: "ink" },
  { x: 12, y: 3, w: 1, h: 2, color: "ink" },
];

export const brickColor = (color: BrickColor) => `var(--color-${color})`;
