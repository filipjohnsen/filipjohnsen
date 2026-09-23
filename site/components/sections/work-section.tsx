import { projects, type Project } from "@/content/projects";
import { BlockArt } from "../block-art";
import { brickColor } from "../hero/bricks";
import { Reveal } from "../reveal";
import { PlaceholderBadge, SectionHeading } from "./section-heading";

const span: Record<Project["size"], string> = {
  wide: "md:col-span-7",
  narrow: "md:col-span-5",
  half: "md:col-span-6",
};

function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.href ? "a" : "div";
  return (
    <Wrapper
      {...(project.href ? { href: project.href } : {})}
      className="group flex h-full flex-col overflow-hidden rounded-[16px] border-2 border-ink bg-paper shadow-brick transition-[translate,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brick-lift motion-reduce:transition-none"
    >
      <div className="relative border-b-2 border-ink p-2" style={{ background: brickColor(project.color) }}>
        <div className="flex items-start justify-between">
          <span className="rounded-md bg-paper px-1 py-0.5 font-mono text-xs font-semibold">Sett {project.set}</span>
          <span className="font-mono text-xs text-paper mix-blend-difference">{project.year}</span>
        </div>
        <div className="mx-auto mt-1 max-w-[420px]">
          <BlockArt seed={project.title} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2 sm:p-3">
        <div className="flex flex-wrap items-center gap-1">
          <h3 className="font-display text-2xl leading-tight font-bold tracking-tight">{project.title}</h3>
          {project.placeholder && <PlaceholderBadge />}
        </div>
        <p className="leading-relaxed text-ink-soft">{project.summary}</p>
        <div className="mt-auto pt-1">
          <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">Deler i esken</p>
          <ul className="mt-0.5 flex flex-wrap gap-0.5">
            {project.parts.map((part) => (
              <li key={part} className="rounded-md border border-ink/25 px-1 py-0.5 font-mono text-xs">
                <span className="text-ink-soft">1×</span> {part}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Wrapper>
  );
}

export function WorkSection() {
  return (
    <section aria-labelledby="sett" className="mx-auto w-full max-w-[1200px] scroll-mt-4 px-2 py-8 sm:px-4 sm:py-12">
      <SectionHeading id="sett" eyebrow={`Sett 01–0${projects.length}`} title="Ting jeg har bygd">
        De ekte prosjektene kommer snart. Inntil videre står det plassholdere her, så du ser
        hvordan det blir.
      </SectionHeading>
      <div className="mt-5 grid gap-3 md:grid-cols-12">
        {projects.map((project, i) => (
          <Reveal key={project.set} className={span[project.size]} delay={(i % 2) * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
