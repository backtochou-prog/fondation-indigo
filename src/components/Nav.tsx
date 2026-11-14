"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { navItems } from "@/lib/nav";


export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = path === "/" && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 text-star transition-[background-color,box-shadow] duration-500 ${overHero || open ? "" : "bg-night/80 shadow-[0_1px_0_rgba(185,164,242,.18)] backdrop-blur-md"}`}>
        <div className="wrap flex h-[4.6rem] items-center justify-between gap-6">
          <Link href="/" aria-label="Fondation Indigo — accueil" className="shrink-0"><Logo /></Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.88rem] font-medium">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                    className={`link-u ${isActive(n.href) ? "" : "[background-size:0_1px]"} hover:[background-size:100%_1px]`}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/nous-rejoindre" className="btn btn-line !min-h-10 !px-5 !py-2">Trouver ma place</Link>
            <Link href="/devenir-mecene" className="btn btn-solid !min-h-10 !px-5 !py-2">Soutenir Indigo</Link>
          </div>

          <button type="button" className="relative z-[60] -mr-2 grid h-12 w-12 place-items-center lg:hidden" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-7">
              <span className={`absolute left-0 h-px w-7 bg-current transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-7 bg-current transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </header>

      {/* menu mobile */}
      <div id="menu-mobile" hidden={!open} className="on-dark fixed inset-0 z-40 overflow-y-auto bg-indigo-deep/98 px-6 pb-12 pt-28 text-star lg:hidden">
        <nav aria-label="Menu mobile">
          <ul className="grid gap-1">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                  className={`block border-b border-star/15 py-4 font-display text-[2rem] leading-none ${isActive(n.href) ? "text-lavender" : ""}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 grid gap-3">
          <Link href="/nous-rejoindre" className="btn btn-line">Trouver ma place</Link>
          <Link href="/devenir-mecene" className="btn btn-solid">Soutenir Indigo</Link>
        </div>
      </div>

      {/* Les deux parcours restent accessibles en permanence sur mobile */}
      {!open && (
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-lavender/25 bg-night/95 p-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <Link href="/nous-rejoindre" className="btn btn-line !min-h-11 !px-3 !py-2 !text-[0.84rem]">Trouver ma place</Link>
          <Link href="/devenir-mecene" className="btn btn-solid !min-h-11 !px-3 !py-2 !text-[0.84rem]">Soutenir Indigo</Link>
        </div>
      )}
    </>
  );
}
