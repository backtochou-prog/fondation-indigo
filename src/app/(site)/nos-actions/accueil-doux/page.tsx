import type { Metadata } from "next";
import { PageHero, Crisis, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Form } from "@/components/Form";
import { AccueilScene } from "@/components/scenes";

export const metadata: Metadata = { title: "L'Accueil Doux — un premier rendez-vous d'écoute", description: "Un rendez-vous d'écoute de 45 minutes, gratuit, pour les personnes qui n'osent pas encore venir en groupe." };

export default function AccueilDoux() {
  return (
    <>
      <PageHero eyebrow="L'Accueil Doux" title={<>Juste être <span className="em-serif text-lavender">écoutée</span>.</>}
        lead="Un premier rendez-vous d'écoute de 45 minutes, gratuit, pour les âmes qui n'osent pas venir en groupe." />

      <section className="pb-20 md:pb-28">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="space-y-12">
            <Reveal><AccueilScene label="Une porte entrouverte — illustration temporaire" className="aspect-[5/4] w-full rounded-t-[40%]" /></Reveal>

            <Reveal>
              <Eyebrow className="text-lavender">Ce que cela offre</Eyebrow>
              <ul className="mt-4 space-y-3">
                {["45 minutes d'écoute, rien que pour vous.", "Gratuit, sans engagement.", "Pas de jugement, pas de diagnostic, pas de « tu dois changer ».", "La possibilité, si vous le souhaitez, de découvrir ensuite le Cercle d'Âmes ou un atelier."].map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{t}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <Eyebrow className="text-lavender">Ce que cela n'est pas</Eyebrow>
              <ul className="mt-4 space-y-3">
                {["Ni une consultation médicale, ni une psychothérapie, ni un diagnostic.", "Ni un service d'urgence.", "Ni un remplacement d'un suivi existant : il peut simplement s'y ajouter."].map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender" />{t}</li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-night-2 p-5"><Crisis /></div>
            </Reveal>

            <Reveal>
              <Eyebrow className="text-lavender">Vos informations</Eyebrow>
              <p className="mt-4 text-[0.97rem]">Nous vous demandons uniquement de quoi vous recontacter. N'écrivez pas d'informations de santé : ce n'est pas nécessaire. Vos données ne servent qu'à organiser ce rendez-vous, ne sont jamais revendues et peuvent être supprimées sur simple demande (voir la <a className="link-u font-semibold" href="/confidentialite">politique de confidentialité</a>).</p>
              <p className="mt-3 text-[0.97rem]">Le cadre de confidentialité des échanges (qui écoute, avec quel statut, quelles limites) sera précisé avant le premier rendez-vous ; nous ne promettons rien au-delà de ce que l'organisation du lieu pourra réellement garantir.</p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="rounded-[1.5rem] bg-night-2 p-6 sm:p-10 lg:sticky lg:top-28">
              <h2 className="t-h3">Demander mon Accueil Doux</h2>
              <p className="mb-7 mt-2 text-sm text-mist/80">Les rendez-vous ne sont pas encore ouverts : en demandant le vôtre, vous serez prévenu·e dès que possible.</p>
              <Form kind="accueil_doux" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
