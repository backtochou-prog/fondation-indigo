import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Crisis } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Form } from "@/components/Form";

export const metadata: Metadata = { title: "Nous rejoindre", description: "Participer à un atelier ou au Cercle d'Âmes, devenir bénévole, proposer vos compétences ou nous écrire." };

const doors = [
  ["#accueil", "Je n'ose pas encore venir en groupe", "L'Accueil Doux : 45 minutes d'écoute, gratuites."],
  ["#participer", "Je veux participer", "Cercle d'Âmes ou ateliers : rejoindre la liste."],
  ["#benevole", "Je veux aider", "Bénévolat, compétences, professionnel·le."],
  ["#partenaire", "Je représente une structure", "Partenariat institutionnel ou d'entreprise."],
  ["#contact", "J'ai une question", "Écrivez-nous simplement."],
];

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-lavender/20 py-16 md:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <Reveal><h2 className="t-h2">{title}</h2><p className="mt-5 max-w-md">{intro}</p></Reveal>
        <Reveal delay={100}><div className="max-w-xl">{children}</div></Reveal>
      </div>
    </section>
  );
}

export default function Rejoindre() {
  return (
    <>
      <PageHero eyebrow="Nous rejoindre" title={<>Trouver <span className="em-serif text-lavender">sa place</span>.</>} lead="Vous n'avez rien à prouver. Choisissez la porte qui vous ressemble." />
      <section className="pb-14">
        <ul className="wrap grid gap-px overflow-hidden rounded-2xl border border-lavender/20 bg-lavender/20 sm:grid-cols-2 lg:grid-cols-5">
          {doors.map(([h, t, d]) => (
            <li key={h} className="bg-night"><a href={h} className="group block h-full p-6 transition-colors duration-500 hover:bg-night-2"><p className="font-display text-xl leading-tight text-star">{t}</p><p className="mt-2 text-sm text-mist/80">{d}</p></a></li>
          ))}
        </ul>
      </section>

      <Block id="accueil" title="L'Accueil Doux" intro="Pour celles et ceux qui n'osent pas venir en groupe : un premier rendez-vous d'écoute de 45 minutes, gratuit.">
        <Link href="/nos-actions/accueil-doux" className="btn btn-solid">Demander un Accueil Doux</Link>
        <div className="mt-8 rounded-2xl bg-night-2 p-5"><Crisis /></div>
      </Block>
      <Block id="participer" title="Participer au Cercle ou aux ateliers" intro="Les dates ne sont pas encore fixées. Inscrivez-vous : nous vous préviendrons en premier.">
        <Form kind="atelier" />
      </Block>
      <Block id="benevole" title="Bénévoles et professionnels" intro="Accueil, logistique, animation, art, écriture, souffle, nature, communication, juridique, comptabilité… vos compétences comptent.">
        <Form kind="benevole" />
      </Block>
      <Block id="partenaire" title="Partenaires institutionnels" intro="Collectivités, fondations, entreprises, associations : construisons un partenariat clair et transparent.">
        <Form kind="partenariat" />
      </Block>
      <Block id="contact" title="Nous écrire" intro="Une question, une idée, un doute ? Écrivez-nous, simplement.">
        <Form kind="contact" />
      </Block>
    </>
  );
}
