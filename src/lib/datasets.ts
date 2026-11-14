import { defaultBudget, defaultObjectives, defaultReports, defaultScenarios, defaultStats } from "./content";

export type Col = { key: string; label: string; type: "text" | "textarea" | "number" | "select"; options?: string[]; wide?: boolean };
export type DatasetName = "stats" | "budget_lines" | "scenarios" | "objectives" | "reports";

export const datasets: Record<DatasetName, { title: string; help: string; cols: Col[]; defaults: Record<string, unknown>[] }> = {
  stats: {
    title: "Statistiques du besoin social",
    help: "Les trois chiffres d'origine. Le statut s'affiche publiquement : ne passez en « verified » qu'après avoir lu la source primaire.",
    cols: [
      { key: "figure", label: "Chiffre", type: "text" },
      { key: "label", label: "Libellé", type: "text", wide: true },
      { key: "status", label: "Statut", type: "select", options: ["verified", "partial", "to_verify", "positioning"] },
      { key: "source_name", label: "Source (nom, date)", type: "textarea", wide: true },
      { key: "source_url", label: "URL de la source", type: "text" },
      { key: "note", label: "Note de méthode", type: "textarea", wide: true },
    ],
    defaults: defaultStats,
  },
  budget_lines: {
    title: "Budget de démarrage — 6 mois",
    help: "Laissez vide tant qu'un montant n'est pas confirmé : le site affichera « À confirmer ». « Financé » = montant réellement reçu ou promis par écrit.",
    cols: [
      { key: "category", label: "Poste", type: "text" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "estimated_eur", label: "Estimé (€)", type: "number" },
      { key: "funded_eur", label: "Déjà financé (€)", type: "number" },
    ],
    defaults: defaultBudget,
  },
  scenarios: {
    title: "Ce que permet une contribution",
    help: "Scénarios illustratifs. Montant vide = « À définir ».",
    cols: [
      { key: "title", label: "Titre", type: "text" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "amount_eur", label: "Montant (€)", type: "number" },
    ],
    defaults: defaultScenarios,
  },
  objectives: {
    title: "Objectifs à six mois et résultats",
    help: "« Objectif » est une cible. « Réalisé » ne doit être rempli qu'avec des résultats constatés.",
    cols: [
      { key: "label", label: "Indicateur", type: "text", wide: true },
      { key: "unit", label: "Précision", type: "textarea", wide: true },
      { key: "target", label: "Objectif", type: "text" },
      { key: "achieved", label: "Réalisé", type: "text" },
    ],
    defaults: defaultObjectives,
  },
  reports: {
    title: "Rapports d'activité publiés",
    help: "Ajoutez un rapport seulement lorsqu'il existe réellement (lien PDF).",
    cols: [
      { key: "title", label: "Titre", type: "text", wide: true },
      { key: "period", label: "Période", type: "text" },
      { key: "url", label: "Lien du document", type: "text", wide: true },
    ],
    defaults: defaultReports,
  },
};

export const isDataset = (n: string): n is DatasetName => n in datasets;
