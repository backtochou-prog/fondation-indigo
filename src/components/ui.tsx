import Link from "next/link";
import type { ReactNode } from "react";

export const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`t-eyebrow ${className}`}>{children}</p>
);

/** Affiche la valeur confirmée, sinon un marqueur « À confirmer » bien visible. */
export function Ph({ value, label = "À confirmer" }: { value?: string | null; label?: string }) {
  return value && value.trim() ? <>{value}</> : <span className="placeholder-tag">{label}</span>;
}

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="relative pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="wrap">
        <Eyebrow className="text-lavender">{eyebrow}</Eyebrow>
        <h1 className="t-h1 mt-5 max-w-4xl">{title}</h1>
        {lead ? <p className="t-lead mt-8 max-w-2xl text-mist/90">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}

export const money = (n: number | null | undefined) =>
  n == null ? null : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(n));

export function Crisis({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <p className={`text-sm leading-relaxed ${tone === "dark" ? "text-star/80" : "text-mist/80"}`}>
      Fondation Indigo n'est pas un service d'urgence. En cas de détresse ou de pensées suicidaires, appelez le{" "}
      <a className="link-u font-semibold" href="tel:3114">3114</a> (numéro national de prévention du suicide, gratuit, 24 h/24) ; en cas de danger immédiat, le{" "}
      <a className="link-u font-semibold" href="tel:15">15</a> ou le <a className="link-u font-semibold" href="tel:112">112</a>.
    </p>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-3 font-semibold ${className}`}>
      <span className="link-u">{children}</span>
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
        <path d="M0 5h20M16 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </Link>
  );
}
