/**
 * Contenus PAR DÉFAUT (utilisés tant que la base Supabase est absente ou vide).
 * Tout ce qui est chiffré, juridique ou biographique est volontairement NON renseigné.
 * Les administrateurs complètent ces valeurs depuis /admin, sans toucher au code.
 */

export type StatStatus = "verified" | "partial" | "to_verify" | "positioning";
export type Stat = { id?: string; figure: string; label: string; status: StatStatus; source_name: string; source_url: string; note: string };
export type BudgetLine = { id?: string; category: string; description: string; estimated_eur: number | null; funded_eur: number | null };
export type Scenario = { id?: string; title: string; description: string; amount_eur: number | null };
export type Objective = { id?: string; label: string; unit: string; target: string | null; achieved: string | null };
export type Report = { id?: string; title: string; period: string; url: string };

export const statusLabel: Record<StatStatus, string> = {
  verified: "Source vérifiée",
  partial: "Source proche · formulation à adapter",
  to_verify: "À vérifier",
  positioning: "Positionnement du projet",
};

export const defaultStats: Stat[] = [
  {
    figure: "1 sur 3",
    label: "personnes en souffrance intérieure en France",
    status: "partial",
    source_name: "Ipsos pour AXA Prévention — enquête d'avril 2024 (GHQ-12), publiée le 9 octobre 2024",
    source_url: "https://www.ipsos.com/fr-fr/sante-mentale-plus-dun-francais-sur-quatre-declare-vivre-des-episodes-de-solitude",
    note: "L'enquête (2 000 adultes de 18 ans et plus) mesure une « suspicion de souffrance psychologique » avec le questionnaire GHQ-12 : environ un Français sur trois (36 % de détresse psychologique selon l'introduction de la page, 56 % chez les moins de 25 ans). « Souffrance intérieure » est la formulation du projet, pas celle de l'étude. Le seuil de score GHQ-12 retenu n'est pas précisé sur la page : à vérifier dans le rapport complet.",
  },
  {
    figure: "60 %",
    label: "des jeunes disent se sentir seuls",
    status: "to_verify",
    source_name: "Ifop, janvier 2024 — 62 % des 18-24 ans se sentent régulièrement seuls (chiffre rapporté par la presse)",
    source_url: "https://www.slate.fr/story/266638/honte-jeunes-sans-amis-galere-trouver-amitie-gen-z-isolement-social-solitude-relations-temoignages-sante-mentale",
    note: "Un chiffre proche (62 % des 18-24 ans) est rapporté par plusieurs médias, mais le commanditaire et la méthodologie divergent selon les sources et le rapport primaire n'a pas été consulté. À ne pas citer sans vérification. Pour mémoire, l'étude Solitudes 2024 (Fondation de France / Crédoc) mesure d'autres indicateurs (24 % des Français de 15 ans et plus se sentent seuls).",
  },
  {
    figure: "0",
    label: "lieu à Strasbourg dédié aux âmes sensibles et en quête de sens",
    status: "positioning",
    source_name: "Constat du projet Fondation Indigo",
    source_url: "",
    note: "Il s'agit du positionnement du projet, pas d'une statistique vérifiée. Un recensement des lieux d'accueil existants à Strasbourg reste à faire avant de l'affirmer comme un fait.",
  },
];

export const defaultBudget: BudgetLine[] = [
  { category: "Local et loyer", description: "Mise à disposition d'un lieu d'accueil à Strasbourg", estimated_eur: null, funded_eur: null },
  { category: "Charges et énergie", description: "Eau, électricité, chauffage, internet", estimated_eur: null, funded_eur: null },
  { category: "Assurances", description: "Responsabilité civile, local, activités", estimated_eur: null, funded_eur: null },
  { category: "Mobilier et équipement", description: "Table, assises, éclairage, plantes, rangements", estimated_eur: null, funded_eur: null },
  { category: "Thé et accueil", description: "Thés, tisanes, vaisselle, petites attentions", estimated_eur: null, funded_eur: null },
  { category: "Matériel d'ateliers", description: "Papier, encres, aquarelle, coussins, supports", estimated_eur: null, funded_eur: null },
  { category: "Intervenants et services professionnels", description: "Animation, supervision, comptabilité, conseil juridique", estimated_eur: null, funded_eur: null },
  { category: "Communication et site web", description: "Site, supports imprimés, photographie", estimated_eur: null, funded_eur: null },
  { category: "Frais administratifs", description: "Banque, démarches, logiciels", estimated_eur: null, funded_eur: null },
  { category: "Réserve de prudence", description: "Imprévus des six premiers mois", estimated_eur: null, funded_eur: null },
];

export const defaultScenarios: Scenario[] = [
  { title: "Une rencontre du Cercle d'Âmes", description: "Le thé, l'espace et l'accompagnement d'une soirée pour douze personnes.", amount_eur: null },
  { title: "Des Accueils Doux offerts", description: "Des premiers rendez-vous d'écoute de 45 minutes, gratuits, pour celles et ceux qui n'osent pas venir en groupe.", amount_eur: null },
  { title: "Un cycle d'ateliers Guérison", description: "Écriture, art, respiration, méditation ou nature : matériel et animation d'une série de séances.", amount_eur: null },
  { title: "Équiper le lieu", description: "Une table, des assises confortables, de la lumière douce et des plantes.", amount_eur: null },
  { title: "Un mois de local", description: "Loyer et charges d'un mois de présence dans un lieu stable.", amount_eur: null },
];

export const defaultObjectives: Objective[] = [
  { label: "Rencontres du Cercle d'Âmes", unit: "sur 6 mois, à raison de 2 par mois", target: "12", achieved: null },
  { label: "Places disponibles au Cercle d'Âmes", unit: "capacité maximale : 12 personnes × 12 rencontres (ce n'est pas un nombre de participants)", target: "144", achieved: null },
  { label: "Ateliers Guérison", unit: "nombre de séances sur 6 mois", target: null, achieved: null },
  { label: "Accueils Doux (45 min, gratuits)", unit: "nombre de rendez-vous sur 6 mois", target: null, achieved: null },
  { label: "Personnes différentes accueillies", unit: "tous programmes confondus", target: null, achieved: null },
];

export const defaultReports: Report[] = [];

export const settingFields: { key: string; label: string; hint?: string }[] = [
  { key: "legal_status", label: "Statut juridique", hint: "ex. association loi 1901, fonds de dotation… à confirmer" },
  { key: "legal_name", label: "Dénomination légale officielle" },
  { key: "registration_id", label: "Numéro d'enregistrement (RNA / SIREN)" },
  { key: "address", label: "Adresse officielle" },
  { key: "contact_email", label: "E-mail de contact public" },
  { key: "phone", label: "Téléphone public" },
  { key: "publication_director", label: "Directeur·rice de la publication" },
  { key: "host", label: "Hébergeur du site (nom, adresse)", hint: "ex. Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — à vérifier" },
  { key: "founder_name", label: "Prénom / nom de la fondatrice (si souhaité)" },
  { key: "founder_photo_url", label: "Photo de la fondatrice (URL, facultatif)" },
  { key: "ancre_title", label: "Ancre Psy — intitulé exact du rôle" },
  { key: "ancre_name", label: "Ancre Psy — nom" },
  { key: "ancre_qualifications", label: "Ancre Psy — qualifications vérifiées" },
  { key: "ancre_role", label: "Ancre Psy — responsabilités et disponibilité" },
  { key: "launch_date", label: "Date de lancement prévue" },
  { key: "tax_status", label: "Éligibilité fiscale des dons", hint: "Ne renseigner qu'après confirmation écrite (rescrit fiscal ou statut vérifié)" },
  { key: "bank_note", label: "Information bancaire / modalités de don" },
];

export const defaultSettings: Record<string, string> = {};
