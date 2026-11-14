import Link from "next/link";
import { requireAdminClient } from "@/lib/supabase";

export default async function Overview() {
  const svc = await requireAdminClient();
  const [news, subs] = await Promise.all([
    svc.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    svc.from("submissions").select("kind,status"),
  ]);
  const rows = subs.data ?? [];
  const fresh = rows.filter((r) => r.status === "new").length;
  return (
    <>
      <h1 className="font-display text-4xl">Vue d'ensemble</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/demandes?status=new" className="rounded-2xl bg-night p-6"><p className="t-eyebrow text-lavender">Nouvelles demandes</p><p className="mt-2 font-display text-5xl">{fresh}</p></Link>
        <Link href="/admin/demandes" className="rounded-2xl bg-night p-6"><p className="t-eyebrow text-lavender">Demandes au total</p><p className="mt-2 font-display text-5xl">{rows.length}</p></Link>
        <div className="rounded-2xl bg-night p-6"><p className="t-eyebrow text-lavender">Abonnés lettre</p><p className="mt-2 font-display text-5xl">{news.count ?? 0}</p></div>
      </div>
      <h2 className="mt-12 font-display text-2xl">Pour commencer</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>Renseignez les <Link className="underline" href="/admin/parametres">informations légales et profils</Link> (restent « À confirmer » tant qu'elles sont vides).</li>
        <li>Dans chaque rubrique de contenu, cliquez « Initialiser avec le contenu par défaut » une fois, puis modifiez les lignes.</li>
        <li>Ne remplissez « Réalisé » et « Déjà financé » qu'avec des résultats constatés.</li>
      </ol>
    </>
  );
}
