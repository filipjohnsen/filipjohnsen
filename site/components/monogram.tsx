const F = [
  [0, 0], [1, 0], [2, 0],
  [0, 1],
  [0, 2], [1, 2],
  [0, 3],
  [0, 4],
];

const J = [
  [5, 0], [6, 0],
  [6, 1],
  [6, 2],
  [4, 3], [6, 3],
  [4, 4], [5, 4], [6, 4],
];

/** "FJ" drawn from 1×1 blocks. Same shapes as app/icon.svg. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 7 5" className={className} aria-hidden="true">
      {F.map(([x, y]) => (
        <rect key={`f${x}${y}`} x={x + 0.06} y={y + 0.06} width={0.88} height={0.88} rx={0.16} fill="var(--color-ink)" />
      ))}
      {J.map(([x, y]) => (
        <rect key={`j${x}${y}`} x={x + 0.06} y={y + 0.06} width={0.88} height={0.88} rx={0.16} fill="var(--color-tomato)" />
      ))}
    </svg>
  );
}
