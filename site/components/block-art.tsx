import { rng } from "@/lib/rng";

/**
 * A small generative "exploded view": a handful of blocks on an 8×4 grid,
 * placed deterministically from a seed so each set gets its own picture.
 */

const sizes = [
  [2, 1],
  [1, 1],
  [3, 1],
  [2, 2],
  [1, 2],
] as const;

export function BlockArt({ seed, count = 6 }: { seed: string; count?: number }) {
  const rand = rng(seed);
  const blocks = Array.from({ length: count }, (_, i) => {
    const [w, h] = sizes[Math.floor(rand() * sizes.length)];
    return {
      w,
      h,
      x: Math.floor(rand() * (9 - w)),
      y: Math.floor(rand() * (5 - h)),
      rot: (rand() - 0.5) * 16,
      light: i % 3 !== 0,
    };
  });

  return (
    <div className="relative aspect-[2/1] w-full" aria-hidden="true">
      {blocks.map((b, i) => (
        <div
          key={i}
          className="absolute rotate-(--rot) p-[1.2%] transition-[rotate] duration-300 group-hover:rotate-0 motion-reduce:transition-none"
          style={
            {
              left: `${(b.x / 8) * 100}%`,
              top: `${(b.y / 4) * 100}%`,
              width: `${(b.w / 8) * 100}%`,
              height: `${(b.h / 4) * 100}%`,
              "--rot": `${b.rot.toFixed(1)}deg`,
            } as React.CSSProperties
          }
        >
          <div
            className={`h-full w-full rounded-[10%] shadow-[inset_0_-4px_0_rgb(0_0_0/0.18)] ${
              b.light ? "bg-paper/90" : "bg-ink/85"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
