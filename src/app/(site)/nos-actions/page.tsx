import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Eyebrow, Ph } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { CercleScene, AteliersScene, AccueilScene } from "@/components/scenes";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Nos actions", description: "Le Cercle d'Âmes, les Ateliers Guérison et l'Accueil Doux : trois manières de trouver sa place à Strasbourg." };
export const revalidate = 300;

const activities = [
  ["Respiration", "Des exercices guidés pour ralentir et revenir à soi."],
  ["Écriture", "Des séances d'écriture créative, sans niveau requis."],
  ["Méditation", "Des temps de calme et de relaxation, accessibles à tous."],
  ["Art", "L'expression par la couleur, la matière, le geste."],
  ["Nature", "Des expériences au contact du vivant."],
];

export default async function Actions() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Quoi ? La solution" title={<>Trois portes pour <span className="em-serif text-lavender">entrer</span>.</>}
        lead="Chaque programme répond à un besoin différent : être écouté, rencontrer, créer. Vous choisissez ce qui vous convient, quand cela vous convient." />

      {/* 01 — CERCLE */}
      <section id="cercle" className="scroll-mt-20 bg-indigo py-20 md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal><CercleScene label="Douze places autour d'une table en bois, avec du thé — illustration temporaire" className="aspect-square w-full rounded-full" /></Reveal>
          <Reveal delay={120}>
            <p className="font-display text-xl text-star">01</p>
            <h2 className="t-h2 mt-1">Le Cercle d'Âmes</h2>
            <p className="mt-6 font-display text-[1.7rem] leading-snug text-star">12 personnes autour d'une table, avec du thé. On écoute, sans juger. On partage.</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              {["2 rencontres par mois", "12 personnes", "Thé & écoute"].map((f) => <li key={f} className="rounded-full border border-star/40 px-4 py-1.5">{f}</li>)}
            </ul>
            <p className="mt-6">On peut parler, écouter, partager une expérience ou simplement être là. Rien n'est obligatoire : personne n'est jugé, personne n'est poussé à s'exprimer.</p>
            <div className="mt-6 rounded-2xl bg-night/70 p-6">
              <p className="t-eyebrow text-gold">Encadré par notre Ancre Psy, notre référente bienveillance</p>
              <p className="mt-3 text-sm">Intitulé exact du rôle : <Ph value={s.ancre_title} />. Nom : <Ph value={s.ancre_name} />. Qualifications : <Ph value={s.ancre_qualifications} />. Responsabilités et disponibilité : <Ph value={s.ancre_role} />.</p>
              <p className="mt-2 text-xs text-mist/75">Le profil sera publié après vérification des qualifications et de la disponibilité réelles de cette personne.</p>
            </div>
            <p className="mt-5 text-sm">Les prochaines dates ne sont pas encore fixées : <Ph value={s.launch_date} label="Date à confirmer" />.</p>
            <Link href="/nous-rejoindre#participer" className="btn btn-solid mt-7">Rejoindre le Cercle</Link>
          </Reveal>
        </div>
      </section>

      {/* 02 — ATELIERS */}
      <section id="ateliers" className="scroll-mt-20 py-20 md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal className="lg:order-1">
            <p className="font-display text-xl text-lavender">02</p>
            <h2 className="t-h2 mt-1">Les Ateliers Guérison</h2>
            <p className="mt-6 font-display text-[1.7rem] leading-snug text-star">Pour apprendre à vivre entre Terre et Ciel, sans couper ses ailes.</p>
            <ul className="mt-8 divide-y divide-lavender/15 border-y border-lavender/15">
              {activities.map(([a, d]) => (
                <li key={a} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"><span className="font-display text-2xl text-star">{a}</span><span>{d}</span></li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-mist/80">Ces ateliers sont des temps créatifs et contemplatifs d'expression et de bien-être. Ils ne constituent ni un traitement médical, ni une psychothérapie, et ne promettent aucune guérison.</p>
            <Link href="/nous-rejoindre#participer" className="btn btn-solid mt-7">M'inscrire à un atelier</Link>
          </Reveal>
          <Reveal delay={120} className="lg:order-2"><AteliersScene label="Une aile de feuilles entre ciel et terre — illustration temporaire" className="aspect-[4/5] w-full rounded-[40%_40%_1.5rem_1.5rem]" /></Reveal>
        </div>
      </section>

      {/* 03 — ACCUEIL DOUX */}
      <section id="accueil" className="scroll-mt-20 bg-violet/25 py-20 md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal><AccueilScene label="Une porte entrouverte et de la lumière — illustration temporaire" className="mx-auto aspect-[4/5] w-full max-w-md rounded-t-full" /></Reveal>
          <Reveal delay={120}>
            <p className="font-display text-xl text-star">03</p>
            <h2 className="t-h2 mt-1">L'Accueil Doux</h2>
            <p className="mt-6 font-display text-[1.7rem] leading-snug text-star">Un premier rendez-vous d'écoute de 45 min, gratuit, pour les âmes qui n'osent pas venir en groupe. Juste être écoutée.</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              {["45 minutes", "Gratuit", "En tête-à-tête"].map((f) => <li key={f} className="rounded-full border border-star/40 px-4 py-1.5">{f}</li>)}
            </ul>
            <p className="mt-6 text-star">Une première rencontre, sans engagement, pour poser quelques mots avant — ou sans — rejoindre un groupe.</p>
            <Link href="/nos-actions/accueil-doux" className="btn btn-solid mt-7">Demander un Accueil Doux</Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <Reveal className="wrap-narrow">
          <Eyebrow className="text-lavender">Ce que nous ne sommes pas</Eyebrow>
          <p className="mt-4 text-lg">Fondation Indigo propose un espace complémentaire d'écoute, de lien et de bien-être. Nous ne posons pas de diagnostic, nous ne prescrivons rien et nous ne remplaçons pas un suivi médical ou psychologique. Si vous êtes accompagné·e, rien ne change : cela peut simplement s'y ajouter.</p>
          <p className="mt-4 text-sm text-mist/80">Vous traversez une période très difficile ? Le 3114 répond gratuitement, 24 h/24.</p>
        </Reveal>
      </section>
    </>
  );
}
