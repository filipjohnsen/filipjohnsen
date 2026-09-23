import Link from "next/link";
import { nav } from "@/content/site";
import { Monogram } from "./monogram";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 px-2 py-2 sm:px-4 sm:py-3">
      <Link href="/" className="group flex items-center gap-1.5 font-display text-lg font-bold tracking-tight">
        <Monogram className="h-4 w-auto transition-transform group-hover:-rotate-3" />
        <span>filipjohnsen</span>
      </Link>
      <nav aria-label="Hovedmeny">
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {nav.map((item) => (
            <li key={item.href} className={item.href === "/#jobb" ? "" : "hidden md:block"}>
              <Link
                href={item.href}
                className={
                  item.href === "/#jobb"
                    ? "rounded-full border-2 border-ink px-2 py-1 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper"
                    : "rounded-full px-1.5 py-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
