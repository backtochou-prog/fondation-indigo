import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Fondation Indigo — L'Âme a sa Place", template: "%s · Fondation Indigo" },
  description: "Un lieu en projet à Strasbourg pour se rencontrer, s'écouter et retrouver sa place. Sans jugement, sans diagnostic, sans pression de changer.",
  openGraph: { type: "website", locale: "fr_FR", siteName: "Fondation Indigo", title: "Fondation Indigo — L'Âme a sa Place", description: "Ton âme a sa place. Tu n'es pas cassée. Tu es juste différente." },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#34364F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /></head>
      <body>{children}</body>
    </html>
  );
}
