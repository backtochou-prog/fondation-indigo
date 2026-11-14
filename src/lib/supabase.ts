import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** Client « service » : SERVEUR UNIQUEMENT. Contourne la RLS — ne l'utiliser qu'après contrôle d'accès. */
let cached: SupabaseClient | null | undefined;
export function serviceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return cached;
}

export const supabaseConfigured = () => serviceClient() !== null;

/** Client lié aux cookies de l'utilisateur connecté (authentification des administrateurs). */
export async function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const store = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* appelé depuis un Server Component : ignoré */ }
      },
    },
  });
}

/** Retourne l'utilisateur uniquement s'il est connecté ET présent dans la table admin_users. */
export async function getAdmin() {
  const auth = await authClient();
  const svc = serviceClient();
  if (!auth || !svc) return null;
  const { data } = await auth.auth.getUser(); // vérifie le jeton côté Supabase (et non le simple cookie)
  const user = data.user;
  if (!user) return null;
  const { data: row } = await svc.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return row ? user : null;
}

/** À appeler au début de CHAQUE page d'administration (un layout ne suffit pas à protéger ses pages). */
export async function requireAdminClient(): Promise<SupabaseClient> {
  const admin = await getAdmin();
  const svc = serviceClient();
  if (!admin || !svc) redirect("/admin/login");
  return svc;
}
