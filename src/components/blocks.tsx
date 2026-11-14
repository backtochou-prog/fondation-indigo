import { statusLabel, type BudgetLine, type Objective, type Report, type Scenario, type Stat } from "@/lib/content";
import { budgetTotals } from "@/lib/data";
import { money } from "./ui";
import { Reveal } from "./Reveal";

/* ───────── Statistiques : chiffre d'origine + statut de vérification ───────── */
export function StatsBlock({ stats, tone = "light", detail = false }: { stats: Stat[]; tone?: "light" | "dark"; detail?: boolean }) {
  const dark = tone === "dark";
  return (
    <ul className="grid gap-x-10 gap-y-12 md:grid-cols-3">
      {stats.map((s, i) => (
        <Reveal as="li" key={s.id ?? s.label} delay={i * 120} className={`border-t pt-6 ${dark ? "border-star/30" : "border-lavender/25"}`}>
          <p className={`font-display text-[clamp(4rem,8vw,6.5rem)] leading-none ${dark ? "text-star" : "text-star"}`}>{s.figure}</p>
          <p className={`mt-4 text-lg leading-snug ${dark ? "text-star" : ""}`}>{s.label}</p>
          <p className={`mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${dark ? "text-gold" : "text-gold"}`}>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${s.status === "verified" ? "bg-gold" : s.status === "partial" ? "bg-lavender" : "border border-current"}`} />
            {statusLabel[s.status]}
          </p>
          {detail ? (
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p><span className="font-semibold">Source : </span>
                {s.source_url ? <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="link-u">{s.source_name}</a> : s.source_name}</p>
              <p className="opacity-85">{s.note}</p>
            </div>
          ) : null}
        </Reveal>
      ))}
    </ul>
  );
}

/* ───────── Objectifs : cible ≠ réalisé ───────── */
export function ObjectivesBlock({ items }: { items: Objective[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-lavender/20">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Objectifs à six mois et résultats constatés</caption>
        <thead className="bg-indigo text-star">
          <tr className="text-xs uppercase tracking-wider">
            <th scope="col" className="px-5 py-4 font-semibold">Indicateur</th>
            <th scope="col" className="px-5 py-4 font-semibold">Objectif</th>
            <th scope="col" className="px-5 py-4 font-semibold">Réalisé</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id ?? o.label} className="border-t border-lavender/15 align-top">
              <th scope="row" className="px-5 py-5 font-medium">
                <span className="block text-star">{o.label}</span>
                <span className="mt-1 block text-sm font-normal text-mist/75">{o.unit}</span>
              </th>
              <td className="px-5 py-5 font-display text-3xl text-star">{o.target ?? <span className="placeholder-tag">À définir</span>}</td>
              <td className="px-5 py-5">{o.achieved ? <span className="font-display text-3xl text-gold">{o.achieved}</span> : <span className="text-sm text-mist/65">Pas encore de résultat publié</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────── Budget de démarrage — 6 mois ───────── */
export function BudgetBlock({ lines }: { lines: BudgetLine[] }) {
  const t = budgetTotals(lines);
  const max = Math.max(...lines.map((l) => Number(l.estimated_eur ?? 0)), 1);
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-lavender/20 bg-lavender/20 sm:grid-cols-3">
        {[
          { k: "Budget estimé", v: t.anyKnown ? money(t.estimated) : null, sub: t.anyKnown && !t.complete ? "somme des postes déjà chiffrés" : "" },
          { k: "Déjà financé", v: t.anyKnown ? money(t.funded) : null, sub: "" },
          { k: "Reste à financer", v: t.anyKnown ? money(t.remaining) : null, sub: "" },
        ].map((c) => (
          <div key={c.k} className="bg-night p-6">
            <p className="t-eyebrow text-lavender">{c.k}</p>
            <p className="mt-3 font-display text-4xl text-star">{c.v ?? <span className="placeholder-tag">À confirmer</span>}</p>
            {c.sub ? <p className="mt-1 text-xs text-mist/70">{c.sub}</p> : null}
          </div>
        ))}
      </div>

      <ol className="mt-10 divide-y divide-lavender/15 border-y border-lavender/15">
        {lines.map((l, i) => {
          const est = l.estimated_eur != null ? Number(l.estimated_eur) : null;
          const fun = l.funded_eur != null ? Number(l.funded_eur) : 0;
          return (
            <li key={l.id ?? l.category} className="grid gap-3 py-5 md:grid-cols-[2.2rem_1.1fr_1.4fr_9rem] md:items-center md:gap-6">
              <span className="font-display text-xl text-lavender" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semibold text-star">{l.category}</p>
                <p className="text-sm text-mist/75">{l.description}</p>
              </div>
              <div role="img" aria-label={est != null ? `${money(fun)} financés sur ${money(est)} estimés` : "Montant non confirmé"} className="relative h-3 overflow-hidden rounded-full bg-lavender/10">
                {est != null ? (
                  <>
                    <div className="absolute inset-y-0 left-0 rounded-full bg-lavender" style={{ width: `${(est / max) * 100}%` }} />
                    <div className="absolute inset-y-0 left-0 rounded-full bg-indigo" style={{ width: `${(Math.min(fun, est) / max) * 100}%` }} />
                  </>
                ) : (
                  <div className="absolute inset-0 rounded-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(52,54,79,.18) 0 6px, transparent 6px 12px)" }} />
                )}
              </div>
              <p className="text-right font-display text-2xl text-star">{est != null ? money(est) : <span className="placeholder-tag">À confirmer</span>}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-sm text-mist/75">
        <span aria-hidden="true" className="mr-1 inline-block h-2.5 w-5 rounded-full bg-lavender align-middle" /> estimé
        <span aria-hidden="true" className="mx-1 ml-5 inline-block h-2.5 w-5 rounded-full bg-indigo align-middle" /> déjà financé.
        Ces postes sont des catégories proposées, non des dépenses confirmées.
      </p>
    </div>
  );
}

export function ScenariosBlock({ items }: { items: Scenario[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-lavender/20 bg-lavender/20 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <li key={s.id ?? s.title} className="flex flex-col justify-between gap-6 bg-night p-7">
          <div>
            <h3 className="t-h3">{s.title}</h3>
            <p className="mt-3 text-[0.95rem] text-mist/85">{s.description}</p>
          </div>
          <p className="font-display text-3xl text-star">{s.amount_eur != null ? money(s.amount_eur) : <span className="placeholder-tag">Montant à définir</span>}</p>
        </li>
      ))}
    </ul>
  );
}

export function ReportsBlock({ items }: { items: Report[] }) {
  if (!items.length) return <p className="rounded-2xl border border-dashed border-lavender/30 p-6 text-mist/80">Aucun rapport d'activité n'est encore publié : le projet n'a pas démarré. Ils seront ajoutés ici dès qu'ils existeront.</p>;
  return (
    <ul className="divide-y divide-lavender/15 border-y border-lavender/15">
      {items.map((r) => (
        <li key={r.id ?? r.title} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
          <span className="font-semibold text-star">{r.title} <span className="font-normal text-mist/70">· {r.period}</span></span>
          {r.url ? <a className="link-u font-semibold" href={r.url} target="_blank" rel="noopener noreferrer">Lire le rapport</a> : null}
        </li>
      ))}
    </ul>
  );
}
