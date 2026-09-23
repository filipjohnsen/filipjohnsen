import Link from "next/link";
import { site } from "@/content/site";
import { Monogram } from "./monogram";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-ink">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-2 py-4 text-sm sm:flex-row sm:items-end sm:justify-between sm:px-4">
        <div className="flex items-center gap-1.5">
          <Monogram className="h-3 w-auto" />
          <span className="font-display font-bold">{site.name}</span>
        </div>
        <ul className="flex flex-col gap-0.5 text-ink-soft sm:flex-row sm:gap-3">
          <li>
            <a href={`mailto:${site.email}`} className="font-medium text-ink underline-offset-4 hover:underline">
              {site.email}
            </a>
          </li>
          <li>Org.nr. {site.orgNr}</li>
          <li>
            <Link href="/personvernserklering" className="underline-offset-4 hover:underline">
              Personvern
            </Link>
          </li>
          <li>Laget i {site.city}</li>
        </ul>
      </div>
    </footer>
  );
}
