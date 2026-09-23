export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="max-w-[720px]">
      <p className={`font-mono text-xs tracking-wide uppercase sm:text-sm ${dark ? "text-paper/60" : "text-ink-soft"}`}>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-1 font-display text-4xl leading-[1] font-extrabold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {children && (
        <p className={`mt-2 text-lg leading-relaxed text-pretty ${dark ? "text-paper/75" : "text-ink-soft"}`}>
          {children}
        </p>
      )}
    </div>
  );
}

export function PlaceholderBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`rounded-full border px-1 py-0.5 font-mono text-[11px] leading-none tracking-wide uppercase ${
        dark ? "border-paper/40 text-paper/70" : "border-ink/40 text-ink-soft"
      }`}
    >
      Plassholder
    </span>
  );
}
