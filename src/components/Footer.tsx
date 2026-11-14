import Link from "next/link";
import { Logo } from "./Logo";
import { Form } from "./Form";
import { Crisis, Ph } from "./ui";
import { navItems } from "@/lib/nav";
import { getSettings } from "@/lib/data";

export async function Footer() {
  const s = await getSettings();
  return (
    <footer className="on-dark relative bg-indigo-deep pb-28 pt-20 text-star lg:pb-12">
      <div className="wrap grid gap-14 lg:grid-cols-[1.3fr_1fr_1.1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-6 font-display text-3xl leading-tight">L'Âme a sa Place.</p>
          <p className="mt-4 max-w-sm text-sm text-star/75">Un lieu en projet à Strasbourg pour se rencontrer, s'écouter et retrouver sa place — sans jugement, sans diagnostic, sans pression de changer.</p>
        </div>
        <nav aria-label="Pied de page">
          <ul className="grid gap-2.5 text-sm">
            {navItems.map((n) => <li key={n.href}><Link className="link-u" href={n.href}>{n.label}</Link></li>)}
            <li className="pt-2"><Link className="link-u" href="/nos-actions/accueil-doux">Demander un Accueil Doux</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-2xl">Recevoir des nouvelles</h2>
          <p className="mb-5 mt-2 text-sm text-star/75">Rarement, et seulement l'essentiel.</p>
          <Form kind="newsletter" tone="dark" compact />
        </div>
      </div>
      <div className="wrap mt-16 grid gap-6 border-t border-star/15 pt-8 text-sm text-star/75">
        <Crisis tone="dark" />
        <p>
          Statut juridique : <Ph value={s.legal_status} /> · Siège : <Ph value={s.address} /> · Contact : <Ph value={s.contact_email} />
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link className="link-u" href="/mentions-legales">Mentions légales</Link></li>
          <li><Link className="link-u" href="/confidentialite">Confidentialité</Link></li>
          <li><Link className="link-u" href="/cookies">Cookies</Link></li>
          <li className="sm:ml-auto">© {new Date().getFullYear()} Fondation Indigo</li>
        </ul>
      </div>
    </footer>
  );
}
