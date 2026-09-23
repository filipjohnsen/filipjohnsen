import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/content/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Filip Johnsen – frontendutvikler i Oslo",
    template: "%s – Filip Johnsen",
  },
  description:
    "Jeg er Filip, frontendutvikler i Oslo. Jeg lager raske nettsider av små, godt laget deler.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Filip Johnsen",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nb"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-2 focus:py-1 focus:text-paper"
        >
          Hopp til innholdet
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
