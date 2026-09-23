import { Reveal } from "../reveal";
import { SectionHeading } from "./section-heading";

const steps = [
  {
    title: "Lær å lage god kaffe",
    body: "Jeg startet bak disken som barista. Der lærte jeg at folk merker når noe er gjort ordentlig, selv om de ikke kan si hvorfor.",
  },
  {
    title: "Lær å lage nettsider",
    body: "Først for moro skyld, så for folk som faktisk betalte. Det er rundt elleve år siden nå.",
  },
  {
    title: "Flow Digital",
    body: "Byråliv. Mange kunder, mange nettsider og en bratt læringskurve.",
  },
  {
    title: "Cognite, 2021–2024",
    body: "Lead Web Developer. Jeg hadde ansvaret for nettsidene til et teknologiselskap som vokste fort, og lærte mye om å si nei til ting.",
  },
  {
    title: "Fjellvann, 2024–",
    body: "Frontendutvikler i et designbyrå i Oslo. Mest Next.js og Sanity, og mye samarbeid med designere som har sterke meninger. Det liker jeg.",
  },
];

const extras = [
  "Løser Advent of Code hver desember",
  "Leker med CSS til det gjør noe rart",
  "Eier altfor mye LEGO",
  "Lager fortsatt god kaffe",
];

export function AboutSection() {
  return (
    <section aria-labelledby="om" className="mx-auto w-full max-w-[1200px] px-2 py-8 sm:px-4 sm:py-12">
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-5">
          <SectionHeading id="om" eyebrow="Om meg" title="Slik ble jeg satt sammen">
            Ingen bruksanvisning fulgte med, så jeg skrev en selv. Den er kort, og trinn seks er
            ikke skrevet ennå.
          </SectionHeading>
          <div className="mt-4 rounded-[16px] border-2 border-dashed border-ink/40 p-2 sm:p-3">
            <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">Løse deler</p>
            <ul className="mt-1 space-y-0.5">
              {extras.map((extra) => (
                <li key={extra} className="flex gap-1">
                  <span className="font-mono text-ink-soft">1×</span>
                  <span>{extra}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="space-y-2 lg:col-span-7">
          {steps.map((step, i) => (
            <Reveal
              key={step.title}
              as="li"
              delay={i * 0.03}
              className="flex gap-2 rounded-[16px] border-2 border-ink bg-paper p-2 sm:gap-3 sm:p-3"
            >
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink font-display text-xl font-extrabold"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    <span className="sr-only">Trinn {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-0.5 leading-relaxed text-ink-soft">{step.body}</p>
                </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
