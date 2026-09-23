export const site = {
  name: "Filip Johnsen",
  url: "https://filipjohnsen.no",
  email: "hei@filipjohnsen.no",
  orgNr: "924614315",
  city: "Oslo",
} as const;

export const nav = [
  { href: "/#sett", label: "Byggesett" },
  { href: "/#lab", label: "Lab" },
  { href: "/#om", label: "Om meg" },
  { href: "/#jobb", label: "Jobb med meg" },
] as const;
