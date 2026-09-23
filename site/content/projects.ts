/**
 * Selected work, shown as "sets" on the front page.
 * Everything here is placeholder content. Replace an entry (and set
 * `placeholder: false`) when a real project is ready to show.
 */

export type BrickColor = "ink" | "tomato" | "cobalt" | "teal" | "mustard";

export type Project = {
  set: string;
  title: string;
  summary: string;
  /** The stack, listed as parts in the box. */
  parts: string[];
  year: string;
  /** Footprint on the 12-column grid at desktop size. */
  size: "wide" | "narrow" | "half";
  color: BrickColor;
  href?: string;
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    set: "01",
    title: "Nettside for en kaffebar",
    summary:
      "En enkel side med meny og åpningstider som eieren endrer selv, fra mobilen, mellom to bestillinger.",
    parts: ["Next.js", "Sanity", "Tailwind"],
    year: "20XX",
    size: "wide",
    color: "tomato",
    placeholder: true,
  },
  {
    set: "02",
    title: "Designsystem for et produktteam",
    summary:
      "Knapper, skjema og kort som ser like ut overalt, dokumentert så de faktisk blir brukt.",
    parts: ["React", "TypeScript", "Storybook"],
    year: "20XX",
    size: "narrow",
    color: "cobalt",
    placeholder: true,
  },
  {
    set: "03",
    title: "Markedsside for et teknologiselskap",
    summary:
      "Mange sider, mange redaktører og et krav om at alt skulle laste raskt. Her kommer et ekte case.",
    parts: ["Next.js", "Sanity", "Vercel"],
    year: "20XX",
    size: "half",
    color: "teal",
    placeholder: true,
  },
  {
    set: "04",
    title: "Byråside med mye bevegelse",
    summary:
      "Animasjoner som ser dyre ut, men som ikke gjør siden treg. Plassholder til jeg har et prosjekt jeg får vise.",
    parts: ["Next.js", "Motion", "GSAP"],
    year: "20XX",
    size: "half",
    color: "mustard",
    placeholder: true,
  },
];
