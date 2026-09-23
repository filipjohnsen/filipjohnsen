import type { Metadata } from "next";
import Link from "next/link";
import { FallenBlocks } from "@/components/fallen-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Siden falt fra hverandre",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="innhold" className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-2 py-6 text-center sm:px-4 sm:py-10">
        <FallenBlocks />
        <p className="mt-4 font-mono text-sm text-ink-soft">Feil 404</p>
        <h1 className="mt-1 font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl">
          Siden falt fra hverandre.
        </h1>
        <p className="mt-2 max-w-[48ch] text-lg text-pretty text-ink-soft">
          Enten finnes ikke denne siden, eller så har noen mistet en brikke under sofaen. Jeg
          satser på det første.
        </p>
        <Link
          href="/"
          className="mt-4 rounded-full border-2 border-ink bg-ink px-3 py-1 font-semibold text-paper shadow-brick transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Tilbake til forsiden
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
