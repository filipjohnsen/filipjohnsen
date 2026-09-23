import { site } from "@/content/site";
import { ContactForm } from "../contact-form";
import { SectionHeading } from "./section-heading";

const offer = [
  "En nettside som laster fort, også på en treg mobil.",
  "Sanity satt opp så du kan endre tekst og bilder selv.",
  "Kode du eier, og som en annen utvikler kan jobbe videre med.",
  "Én person å forholde seg til, som svarer på e-post.",
];

export function WorkWithMeSection() {
  return (
    <section aria-labelledby="jobb" className="border-t-2 border-ink bg-paper-deep">
      <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-2 py-8 sm:px-4 sm:py-12 lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-6">
          <SectionHeading id="jobb" eyebrow="Jobb med meg" title="Trenger du en nettside?">
            Ved siden av jobben tar jeg på meg noen få prosjekter gjennom mitt eget firma. Jeg
            lager raske nettsider i Next.js, og du snakker med meg hele veien. Ikke med en selger.
          </SectionHeading>
          <ul className="mt-4 space-y-1.5">
            {offer.map((item) => (
              <li key={item} className="flex gap-1.5">
                <span aria-hidden="true" className="mt-[7px] size-[10px] shrink-0 rounded-[3px] bg-teal" />
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-ink-soft">
            Liker du ikke skjema? Send en e-post til{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-ink underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="rounded-[20px] border-2 border-ink bg-paper p-2 shadow-brick-lift sm:p-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
