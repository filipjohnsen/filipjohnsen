import { labSets, type LabSet } from "@/content/lab";
import { brickColor } from "../hero/bricks";
import { Reveal } from "../reveal";
import { PlaceholderBadge, SectionHeading } from "./section-heading";

const difficultyLabel = ["", "lett", "middels", "vrien"];

function Difficulty({ level }: { level: LabSet["difficulty"] }) {
  return (
    <span role="img" className="flex items-center gap-[4px]" aria-label={`Vanskelighetsgrad: ${difficultyLabel[level]}`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className={`size-[8px] rounded-full ${n <= level ? "bg-paper" : "border border-paper/40"}`}
        />
      ))}
    </span>
  );
}

function LabCard({ item }: { item: LabSet }) {
  const Wrapper = item.href ? "a" : "div";
  return (
    <Wrapper
      {...(item.href ? { href: item.href } : {})}
      className="group flex h-full flex-col rounded-[16px] border-2 border-paper/20 bg-paper/[0.04] p-2 transition-colors hover:border-paper/60 sm:p-3"
    >
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1">
          <span aria-hidden="true" className="size-2 rounded-[5px]" style={{ background: brickColor(item.color === "ink" ? "mustard" : item.color) }} />
          <span className="font-mono text-sm text-paper/70">Sett {item.set}</span>
        </span>
        {item.placeholder && <PlaceholderBadge dark />}
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight font-bold tracking-tight">{item.title}</h3>
      <p className="mt-1 leading-relaxed text-paper/75">{item.summary}</p>
      <div className="mt-auto flex items-center justify-between pt-3 font-mono text-xs text-paper/60">
        <span>{item.pieces} deler</span>
        <Difficulty level={item.difficulty} />
      </div>
    </Wrapper>
  );
}

export function LabSection() {
  return (
    <section aria-labelledby="lab" className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1200px] px-2 py-8 sm:px-4 sm:py-12">
        <SectionHeading id="lab" eyebrow="Laben" title="Små eksperimenter, bygd på kveldstid" dark>
          Ting jeg lager for å lære noe, eller fordi jeg ikke fikk det ut av hodet. Ikke alt er
          nyttig. Det meste er gøy.
        </SectionHeading>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {labSets.map((item, i) => (
            <Reveal key={item.set} delay={(i % 3) * 0.05}>
              <LabCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
