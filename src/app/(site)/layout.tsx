import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-night focus:px-5 focus:py-3 focus:text-star">Aller au contenu</a>
      <Nav />
      <main id="contenu">{children}</main>
      <Footer />
    </>
  );
}
