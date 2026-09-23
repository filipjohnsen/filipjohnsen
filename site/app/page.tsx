import { BrickHero } from "@/components/hero/brick-hero";
import { AboutSection } from "@/components/sections/about-section";
import { LabSection } from "@/components/sections/lab-section";
import { WorkSection } from "@/components/sections/work-section";
import { WorkWithMeSection } from "@/components/sections/work-with-me-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="innhold" className="flex-1">
        <BrickHero />
        <div aria-hidden="true" className="mx-auto mt-8 w-full max-w-[1200px] px-2 sm:mt-12 sm:px-4">
          <div className="stud-row w-24 opacity-80" />
        </div>
        <WorkSection />
        <LabSection />
        <AboutSection />
        <WorkWithMeSection />
      </main>
      <SiteFooter />
    </>
  );
}
