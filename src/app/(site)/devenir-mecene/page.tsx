import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Eyebrow, Ph } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Form } from "@/components/Form";
import { DonationPanel } from "@/components/DonationPanel";
import { BudgetBlock, ScenariosBlock, StatsBlock } from "@/components/blocks";
import { StoryScene, CercleScene, AteliersScene, AccueilScene } from "@/components/scenes";
import { getBudget, getScenarios, getSettings, getStats } from "@/lib/data";
import { founderStory, problemText, programs } from "@/lib/story";

export const metadata: Metadata = { title: "Devenir mécène", description: "Une histoire, un besoin, une solution, un budget : tout ce qu'un mécène veut savoir avant de soutenir Fondation Indigo." };
export const revalidate = 300;

const scenes = { cercle: CercleScene, ateliers: AteliersScene, accueil: AccueilScene } as const;

export default async function Mecene() {
  const [stats, budget, scenarios, s] = await Promise.all([getStats(), getBudget(), getScenarios(), getSettings()]);
  return (
    <>
      <PageHero eyebrow="Devenir mécène" title={<>Avant les chiffres, il y a <span className="em-serif text-lavender">une personne</span>.</>}
        lead="Quatre étapes pour tout comprendre : qui est derrière le projet, pourquoi il existe, ce qu'il propose, et combien il coûte.">
        <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold">
          {[["#qui", "1 · Qui sommes-nous ?"], ["#pourquoi", "2 · Pourquoi ?"], ["#quoi", "3 · Quoi ?"], ["#budget", "4 · Combien ?"]].map(([h, l]) => <li key={h}><a href={h} className="link-u">{l}</a></li>)}
        </ol>
      </PageHero>

      {/* 1 — QUI */}
      <section id="qui" className="scroll-mt-20 pb-20 md:pb-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <Reveal><StoryScene label="Paysage de brume — illustration temporaire" className="aspect-[4/5] w-full rounded-[2rem_2rem_2rem_0.5rem]" /></Reveal>
          <Reveal delay={120} className="self-center">
            <Eyebrow className="text-lavender">1 · Qui sommes-nous ?</Eyebrow>
            <div className="mt-6 space-y-5 font-display text-[1.6rem] leading-[1.35] text-star">
              {founderStory.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <p className="mt-6 text-sm text-mist/75">— La fondatrice, <Ph value={s.founder_name} label="Nom à confirmer" /></p>
          </Reveal>
        </div>
      </section>

      {/* 2 — POURQUOI */}
      <section id="pourquoi" className="on-dark section scroll-mt-20 bg-indigo text-star">
        <div className="wrap">
          <Reveal className="max-w-3xl">
            <Eyebrow className="text-lavender">2 · Pourquoi ? Le problème</Eyebrow>
            <div className="mt-6 space-y-4 text-lg text-star/90">
              <p>{problemText.intro}</p>
              <p>{problemText.lines.join(" ")}</p>
              <p>{problemText.said}</p>
              <p className="font-display text-3xl text-star">{problemText.result}</p>
              <p>{problemText.gap}</p>
              <p className="font-display text-2xl italic text-lavender">{problemText.close}</p>
            </div>
          </Reveal>
          <div className="mt-16"><StatsBlock stats={stats} tone="dark" /></div>
          <p className="mt-8 max-w-2xl text-sm text-star/75">Fondation Indigo est un espace complémentaire : il ne remplace pas un suivi médical ou psychologique. <Link href="/notre-impact#besoin" className="link-u font-semibold">Sources et statut de chaque chiffre</Link>.</p>
        </div>
      </section>

      {/* 3 — QUOI */}
      <section id="quoi" className="section scroll-mt-20">
        <div className="wrap">
          <Reveal className="max-w-2xl"><Eyebrow className="text-lavender">3 · Quoi ? La solution</Eyebrow><h2 className="t-h2 mt-5">Trois programmes, un même principe d'accueil.</h2></Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {programs.map((p, i) => {
              const Scene = scenes[p.id as keyof typeof scenes];
              return (
                <Reveal key={p.id} delay={i * 100}>
                  <Scene label={`${p.name} — illustration`} className="aspect-[4/3] w-full rounded-2xl" />
                  <h3 className="t-h3 mt-5">{p.name}</h3>
                  <p className="mt-2 text-[0.95rem]">{p.tagline}</p>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10"><Link href="/nos-actions" className="link-u font-semibold">Détail des trois programmes</Link></div>
        </div>
      </section>

      {/* 4 — COMBIEN */}
      <section id="budget" className="bg-night-2 section scroll-mt-20">
        <div className="wrap">
          <Reveal className="mb-12 max-w-3xl">
            <Eyebrow className="text-lavender">4 · Combien ? Et où va votre argent ?</Eyebrow>
            <h2 className="t-h2 mt-5">Budget de démarrage — 6 mois.</h2>
            <p className="mt-6">C'est la page qui compte le plus pour un mécène : savoir où va l'argent. Voici le cadre du budget, poste par poste. Aucun montant n'est affiché tant qu'il n'est pas confirmé.</p>
          </Reveal>
          <BudgetBlock lines={budget} />

          <Reveal className="mb-8 mt-24 max-w-3xl"><h3 className="t-h2">Ce que permet une contribution</h3><p className="mt-4">Des scénarios pour visualiser concrètement l'effet d'un soutien. Les montants sont des exemples à définir, pas des tarifs établis.</p></Reveal>
          <ScenariosBlock items={scenarios} />

          <Reveal className="mt-24 grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="t-h3">Ce que le mécène gagne</h3>
              <ul className="mt-5 space-y-3">
                {["Savoir précisément à quoi sert chaque contribution.", "Des comptes rendus réguliers, avec objectifs et résultats distingués.", "Le lien direct avec le projet et les personnes qu'il accueille.", "Une reconnaissance, si vous le souhaitez (ou l'anonymat)."].map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{t}</li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-night p-5 text-sm">
                <strong>Avantage fiscal :</strong> {s.tax_status ? s.tax_status : <>aucune réduction d'impôt n'est promise à ce stade. L'éligibilité des dons <span className="placeholder-tag">À confirmer</span> dépend du statut juridique de la structure.</>}
              </p>
            </div>
            <div>
              <h3 className="t-h3">Comment les dons seront gérés</h3>
              <ul className="mt-5 space-y-3 text-[0.97rem]">
                <li>Structure juridique : <Ph value={s.legal_status} />.</li>
                <li>Modalités bancaires : <Ph value={s.bank_note} />.</li>
                <li>Publication des fonds reçus et dépensés sur la page <Link className="link-u font-semibold" href="/notre-impact#finances">Impact et transparence</Link>.</li>
                <li>Aucun paiement n'est collecté tant que ce cadre n'est pas vérifié.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trois manières de soutenir */}
      <section id="soutenir" className="section scroll-mt-20">
        <div className="wrap">
          <Reveal className="max-w-2xl"><Eyebrow className="text-lavender">Trois manières de soutenir</Eyebrow><h2 className="t-h2 mt-5">Donner de l'argent, des moyens ou du temps.</h2></Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-lavender/20 bg-lavender/20 lg:grid-cols-3">
            {[
              ["Mécénat individuel", "Une contribution ponctuelle ou régulière, à la hauteur de ce que vous souhaitez.", "bg-night"],
              ["Mécénat d'entreprise", "Soutien financier, parrainage d'un poste du budget ou partenariat construit avec vous.", "bg-night"],
              ["Compétences et matériel", "Un lieu, du mobilier, des services professionnels, du bénévolat : ce que vous savez ou possédez est précieux.", "bg-night"],
            ].map(([t, d, bg]) => (
              <div key={t} className={`${bg} p-8`}><h3 className="t-h3">{t}</h3><p className="mt-3">{d}</p></div>
            ))}
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
            <DonationPanel />
            <div id="intention" className="scroll-mt-24">
              <h3 className="t-h3">Faire part de mon intention</h3>
              <p className="mb-6 mt-2 text-sm">Sans engagement : nous vous répondrons pour échanger.</p>
              <Form kind="mecenat" />
            </div>
          </div>
          <div id="partenariat" className="mt-24 scroll-mt-24 rounded-[1.5rem] bg-indigo p-7 text-star sm:p-12 on-dark">
            <h3 className="t-h2">Demande de partenariat</h3>
            <p className="mb-8 mt-3 max-w-xl text-star/85">Entreprise, fondation, institution, association : parlons de ce que nous pouvons construire ensemble.</p>
            <div className="max-w-2xl"><Form kind="partenariat" tone="dark" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
