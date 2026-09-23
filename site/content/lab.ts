/**
 * Lab experiments, each presented as a numbered set.
 * Set 000 (the hero) is real; the rest are placeholders.
 */

import type { BrickColor } from "./projects";

export type LabSet = {
  set: string;
  title: string;
  summary: string;
  pieces: number;
  /** 1–3 */
  difficulty: 1 | 2 | 3;
  color: BrickColor;
  href?: string;
  placeholder: boolean;
};

export const labSets: LabSet[] = [
  {
    set: "000",
    title: "Denne toppen",
    summary:
      "Navnet øverst på siden. 21 brikker, litt fysikk og en regel: alt skal kunne bygges igjen.",
    pieces: 21,
    difficulty: 2,
    color: "ink",
    href: "/#topp",
    placeholder: false,
  },
  {
    set: "101",
    title: "Advent of Code, visualisert",
    summary: "Desemberoppgavene tegnet ut, dag for dag, så man ser hva koden faktisk gjør.",
    pieces: 25,
    difficulty: 3,
    color: "teal",
    placeholder: true,
  },
  {
    set: "102",
    title: "Container queries med kort",
    summary: "Ett kort, fem bredder. Et lite demo som viser hvorfor jeg liker container queries.",
    pieces: 5,
    difficulty: 1,
    color: "cobalt",
    placeholder: true,
  },
  {
    set: "103",
    title: "Knapper som klikker",
    summary: "Trykkbare knapper med dybde og lyd, laget med bare CSS og litt Web Audio.",
    pieces: 12,
    difficulty: 1,
    color: "tomato",
    placeholder: true,
  },
  {
    set: "104",
    title: "Kaffekalkulatoren",
    summary: "Gram kaffe per liter vann, uten hoderegning klokka sju om morgenen.",
    pieces: 3,
    difficulty: 1,
    color: "mustard",
    placeholder: true,
  },
];
