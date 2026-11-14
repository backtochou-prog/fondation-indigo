"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient, getAdmin, serviceClient } from "@/lib/supabase";
import { datasets, isDataset } from "@/lib/datasets";
import { settingFields } from "@/lib/content";

async function guard() {
  const admin = await getAdmin();
  const svc = serviceClient();
  if (!admin || !svc) throw new Error("Non autorisé");
  return svc;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const auth = await authClient();
  if (!auth || !email || !password) redirect("/admin/login?e=config");
  const { error } = await auth.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?e=creds");
  if (!(await getAdmin())) {
    await auth.auth.signOut();
    redirect("/admin/login?e=denied");
  }
  redirect("/admin");
}

export async function logout() {
  const auth = await authClient();
  await auth?.auth.signOut();
  redirect("/admin/login");
}

const STATUSES = ["new", "in_progress", "done", "archived"];

export async function setStatus(formData: FormData) {
  const svc = await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.includes(status)) return;
  await svc.from("submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/demandes");
}

export async function deleteSubmission(formData: FormData) {
  const svc = await guard();
  await svc.from("submissions").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/demandes");
}

function coerce(name: string, formData: FormData) {
  const cfg = datasets[name as keyof typeof datasets];
  const out: Record<string, unknown> = {};
  for (const c of cfg.cols) {
    const raw = String(formData.get(c.key) ?? "").trim();
    if (c.type === "number") {
      const n = raw === "" ? null : Number(raw.replace(",", "."));
      out[c.key] = n !== null && Number.isFinite(n) && n >= 0 ? n : null;
    } else if (c.key === "target" || c.key === "achieved") out[c.key] = raw === "" ? null : raw;
    else out[c.key] = raw;
  }
  const sort = Number(formData.get("sort"));
  out.sort = Number.isFinite(sort) ? sort : 0;
  out.published = formData.get("published") === "on";
  return out;
}

export async function saveRow(formData: FormData) {
  const svc = await guard();
  const name = String(formData.get("dataset"));
  if (!isDataset(name)) return;
  const row = coerce(name, formData);
  const id = String(formData.get("id") ?? "");
  if (id) await svc.from(name).update(row).eq("id", id);
  else await svc.from(name).insert(row);
  revalidatePath("/", "layout");
}

export async function deleteRow(formData: FormData) {
  const svc = await guard();
  const name = String(formData.get("dataset"));
  if (!isDataset(name)) return;
  await svc.from(name).delete().eq("id", String(formData.get("id")));
  revalidatePath("/", "layout");
}

/** Copie le contenu par défaut du code dans la base (uniquement si la table est vide). */
export async function seedDataset(formData: FormData) {
  const svc = await guard();
  const name = String(formData.get("dataset"));
  if (!isDataset(name)) return;
  const { count } = await svc.from(name).select("id", { count: "exact", head: true });
  if (count) return;
  const rows = datasets[name].defaults.map((r, i) => ({ ...r, sort: i, published: true }));
  if (rows.length) await svc.from(name).insert(rows);
  revalidatePath("/", "layout");
}

export async function saveSettings(formData: FormData) {
  const svc = await guard();
  const rows = settingFields.map((f) => ({ key: f.key, value: String(formData.get(f.key) ?? "").trim().slice(0, 2000) }));
  await svc.from("settings").upsert(rows, { onConflict: "key" });
  revalidatePath("/", "layout");
}
