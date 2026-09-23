import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Personvern",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="innhold" className="mx-auto w-full max-w-[720px] flex-1 px-2 py-6 sm:px-4 sm:py-10">
        <p className="font-mono text-sm text-ink-soft">Personvernerklæring</p>
        <h1 className="mt-1 font-display text-5xl leading-[0.95] font-extrabold tracking-tight">
          Kort fortalt: jeg samler nesten ingenting.
        </h1>
        <div className="mt-4 space-y-3 text-lg leading-relaxed text-ink-soft [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink">
          <p>
            Denne nettsiden eies av {site.name} (org.nr. {site.orgNr}). Her står det hva som
            skjer med opplysningene dine når du besøker siden eller tar kontakt.
          </p>
          <h2>Kontaktskjemaet</h2>
          <p>
            Når du sender en melding, får jeg navnet ditt, e-postadressen din og det du skriver.
            Jeg bruker det bare til å svare deg og eventuelt lage et tilbud. Jeg deler det ikke med
            noen, og jeg sletter det når vi ikke lenger har noe å snakke om.
          </p>
          <h2>Informasjonskapsler og sporing</h2>
          <p>
            Siden bruker ingen sporingskapsler og ingen annonseverktøy. Hvis jeg legger til
            besøksstatistikk senere, blir det et verktøy som ikke kjenner igjen deg personlig.
          </p>
          <h2>Dine rettigheter</h2>
          <p>
            Du kan be om å få se, rette eller slette det jeg har lagret om deg. Send en e-post til{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-ink underline underline-offset-4">
              {site.email}
            </a>
            , så ordner jeg det.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
