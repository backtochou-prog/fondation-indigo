import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Eyebrow, money } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { StatsBlock, ObjectivesBlock, BudgetBlock, ReportsBlock } from "@/components/blocks";
import { budgetTotals, getBudget, getObjectives, getReports, getStats } from "@/lib/data";

export const metadata: Metadata = { title: "Notre impact et transparence", description: "Le besoin, les objectifs à six mois, le budget de démarrage et les rapports : ce qui est prévu, ce qui est réalisé, en toute transparence." };
export const revalidate = 300;

export default async function Impact() {
  const [stats, objectives, budget, reports] = await Promise.all([getStats(), getObjectives(), getBudget(), getReports()]);
  const t = budgetTotals(budget);
  return (
    <>
      <PageHero eyebrow="Impact et transparence" title={<>Ce qui est <span className="em-serif text-lavender">prévu</span>. Ce qui est <span className="em-serif text-lavender">réalisé</span>.</>}
        lead="Nous distinguons toujours une cible d'un résultat. Tant que le projet n'a pas démarré, aucun résultat n'est annoncé." />

      <section className="pb-6">
        <div className="wrap">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full border border-lavender" /> Objectif : une cible, pas un résultat</li>
            <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-gold" /> Réalisé : constaté et documenté</li>
            <li className="flex items-center gap-2"><span className="placeholder-tag">À confirmer</span> information pas encore établie</li>
          </ul>
        </div>
      </section>

      <section id="besoin" className="section scroll-mt-20">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <Eyebrow className="text-lavender">Le besoin social</Eyebrow>
            <h2 className="t-h2 mt-5">Trois chiffres, et la vérité sur chacun.</h2>
            <p className="mt-6">Ces trois chiffres viennent du projet d'origine. Nous avons cherché leurs sources : voici ce qui est établi, ce qui est proche, et ce qui n'est qu'un positionnement.</p>
          </Reveal>
          <div className="mt-14"><StatsBlock stats={stats} detail /></div>
        </div>
      </section>

      <section id="objectifs" className="bg-night-2 section scroll-mt-20">
        <div className="wrap">
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow className="text-lavender">Six premiers mois</Eyebrow>
            <h2 className="t-h2 mt-5">Objectifs, fréquence et participation.</h2>
            <p className="mt-6">Le Cercle d'Âmes se réunit deux fois par mois, pour douze personnes au maximum. Les autres cibles sont à définir avant le lancement.</p>
          </Reveal>
          <ObjectivesBlock items={objectives} />
        </div>
      </section>

      <section id="finances" className="section scroll-mt-20">
        <div className="wrap">
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow className="text-lavender">Transparence financière</Eyebrow>
            <h2 className="t-h2 mt-5">Budget de démarrage — 6 mois.</h2>
            <p className="mt-6">
              Fonds reçus : {t.anyKnown ? money(t.funded) : <span className="placeholder-tag">À confirmer</span>} · Dépenses réalisées : aucune dépense n'est publiée à ce jour.
              Les montants ci-dessous restent « À confirmer » tant qu'ils ne sont pas établis.
            </p>
          </Reveal>
          <BudgetBlock lines={budget} />
          <div className="mt-10"><Link href="/devenir-mecene#budget" className="link-u font-semibold">Comprendre ce que permet une contribution</Link></div>
        </div>
      </section>

      <section className="bg-night-2 section">
        <div className="wrap">
          <Reveal className="mb-10 max-w-2xl"><Eyebrow className="text-lavender">Rapports d'activité</Eyebrow><h2 className="t-h2 mt-5">Rendre des comptes.</h2></Reveal>
          <ReportsBlock items={reports} />
        </div>
      </section>
    </>
  );
}
