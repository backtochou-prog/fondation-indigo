import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { mkdir, appendFile } from "node:fs/promises";
import { forms, type FormKind } from "@/lib/forms";
import { schemaFor } from "@/lib/schemas";
import { serviceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const WINDOW_MIN = 10;
const MAX_PER_WINDOW = 5;
const memory = new Map<string, number[]>(); // repli sans base de données (développement)

function ipHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? "dev-salt"}:${ip}`).digest("hex").slice(0, 40);
}

async function tooMany(hash: string): Promise<boolean> {
  const svc = serviceClient();
  const since = Date.now() - WINDOW_MIN * 60_000;
  if (svc) {
    const [a, b] = await Promise.all([
      svc.from("submissions").select("id", { count: "exact", head: true }).eq("ip_hash", hash).gte("created_at", new Date(since).toISOString()),
      svc.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("ip_hash", hash).gte("created_at", new Date(since).toISOString()),
    ]);
    return (a.count ?? 0) + (b.count ?? 0) >= MAX_PER_WINDOW;
  }
  const hits = (memory.get(hash) ?? []).filter((t) => t > since);
  memory.set(hash, hits);
  return hits.length >= MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  // Refus des requêtes inter-origines
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });

  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return NextResponse.json({ ok: false, error: "Requête trop volumineuse." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 }); }

  const kind = body.kind as FormKind;
  if (!kind || !(kind in forms)) return NextResponse.json({ ok: false, error: "Formulaire inconnu." }, { status: 400 });

  // Pot de miel : les robots remplissent « website ». On répond « ok » sans rien enregistrer.
  if (typeof body.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });

  const { kind: _k, website: _w, ...fields } = body;
  void _k; void _w;
  const parsed = schemaFor(kind).safeParse(fields);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0] ?? "form")] ??= i.message;
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const hash = ipHash(req);
  if (await tooMany(hash)) return NextResponse.json({ ok: false, error: "Trop de demandes en peu de temps. Merci de réessayer dans quelques minutes." }, { status: 429 });

  const { consent, ...data } = parsed.data as Record<string, unknown> & { consent: true };
  const svc = serviceClient();

  if (svc) {
    if (kind === "newsletter") {
      const { error } = await svc.from("newsletter_subscribers").upsert({ email: data.email, consent_at: new Date().toISOString(), ip_hash: hash }, { onConflict: "email", ignoreDuplicates: true });
      if (error) return NextResponse.json({ ok: false, error: "Enregistrement impossible pour le moment." }, { status: 500 });
    } else {
      const { name, email, phone, message, ...extra } = data as Record<string, string | undefined>;
      const { error } = await svc.from("submissions").insert({
        kind, name: name ?? null, email: email ?? null, phone: phone || null, message: message || null,
        payload: extra, consent: consent === true, ip_hash: hash,
      });
      if (error) return NextResponse.json({ ok: false, error: "Enregistrement impossible pour le moment." }, { status: 500 });
    }
  } else if (process.env.NODE_ENV !== "production" || process.env.LOCAL_SUBMISSIONS_FALLBACK === "true") {
    // Mode développement sans Supabase : fichier local ignoré par git.
    await mkdir(".data", { recursive: true });
    await appendFile(".data/submissions.jsonl", JSON.stringify({ at: new Date().toISOString(), kind, data }) + "\n");
  } else {
    return NextResponse.json({ ok: false, error: "Le service d'enregistrement n'est pas encore configuré." }, { status: 503 });
  }

  memory.set(hash, [...(memory.get(hash) ?? []), Date.now()]);
  return NextResponse.json({ ok: true });
}
