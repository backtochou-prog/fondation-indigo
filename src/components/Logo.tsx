import { logoMarkInner, LOGO_VIEWBOX, type LogoVariant } from "@/lib/logo-geometry";

export function LogoMark({ className, variant = "color", title, id = "lg" }: { className?: string; variant?: LogoVariant; title?: string; id?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} fill="none"
      dangerouslySetInnerHTML={{ __html: logoMarkInner(variant, id) }} />
  );
}

/** Marque + logotype « FONDATION INDIGO » (capitales espacées, comme sur l'image d'origine). */
export function Logo({ className, id = "lgnav" }: { className?: string; tone?: "dark" | "light"; id?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 text-star ${className ?? ""}`}>
      <LogoMark className="h-11 w-14 shrink-0" id={id} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-medium uppercase tracking-[0.2em]">Fondation</span>
        <span className="mt-1 font-display text-[1.5rem] font-medium uppercase tracking-[0.26em] text-star">Indigo</span>
      </span>
    </span>
  );
}
