import "server-only";
import { serviceClient } from "./supabase";
import { datasets, type DatasetName } from "./datasets";
import { defaultSettings, type BudgetLine, type Objective, type Report, type Scenario, type Stat } from "./content";

/** Lit un jeu de données : base Supabase si elle contient des lignes publiées, sinon valeurs par défaut du code. */
async function load<T>(name: DatasetName): Promise<{ rows: T[]; fromDb: boolean }> {
  const svc = serviceClient();
  if (svc) {
    const { data, error } = await svc.from(name).select("*").eq("published", true).order("sort", { ascending: true });
    if (!error && data && data.length) return { rows: data as T[], fromDb: true };
  }
  return { rows: datasets[name].defaults as T[], fromDb: false };
}

export const getStats = async () => (await load<Stat>("stats")).rows;
export const getBudget = async () => (await load<BudgetLine>("budget_lines")).rows;
export const getScenarios = async () => (await load<Scenario>("scenarios")).rows;
export const getObjectives = async () => (await load<Objective>("objectives")).rows;
export const getReports = async () => (await load<Report>("reports")).rows;

export async function getSettings(): Promise<Record<string, string>> {
  const svc = serviceClient();
  if (svc) {
    const { data, error } = await svc.from("settings").select("key,value");
    if (!error && data) return { ...defaultSettings, ...Object.fromEntries(data.map((r) => [r.key, r.value as string])) };
  }
  return defaultSettings;
}

export function budgetTotals(lines: BudgetLine[]) {
  const known = lines.filter((l) => l.estimated_eur != null);
  const estimated = known.reduce((s, l) => s + Number(l.estimated_eur), 0);
  const funded = lines.reduce((s, l) => s + (l.funded_eur != null ? Number(l.funded_eur) : 0), 0);
  return { estimated, funded, remaining: Math.max(estimated - funded, 0), complete: known.length === lines.length && lines.length > 0, anyKnown: known.length > 0 };
}
