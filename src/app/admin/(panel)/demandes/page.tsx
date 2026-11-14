import Link from "next/link";
import { requireAdminClient } from "@/lib/supabase";
import { deleteSubmission, setStatus } from "../../actions";

const kinds: Record<string, string> = { contact: "Contact", accueil_doux: "Accueil Doux", atelier: "Ateliers / Cercle", benevole: "Bénévolat", partenariat: "Partenariats", mecenat: "Mécénat" };
const statuses: Record<string, string> = { new: "Nouvelle", in_progress: "En cours", done: "Traitée", archived: "Archivée" };

export default async function Demandes({ searchParams }: { searchParams: Promise<{ kind?: string; status?: string }> }) {
  const { kind, status } = await searchParams;
  const svc = await requireAdminClient();
  let q = svc.from("submissions").select("*").order("created_at", { ascending: false }).limit(200);
  if (kind && kind in kinds) q = q.eq("kind", kind);
  if (status && status in statuses) q = q.eq("status", status);
  const { data } = await q;
  return (
    <>
      <h1 className="font-display text-4xl">Demandes reçues</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist/80">Données personnelles : ne les exportez pas ni ne les partagez hors du cadre prévu par la politique de confidentialité. Supprimez une demande dès qu'elle n'est plus utile.</p>
      <nav aria-label="Filtres" className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/demandes" className="btn btn-line !min-h-9 !px-4 !py-1">Toutes</Link>
        {Object.entries(kinds).map(([k, l]) => <Link key={k} href={`/admin/demandes?kind=${k}`} className={`btn !min-h-9 !px-4 !py-1 ${kind === k ? "btn-solid" : "btn-line"}`}>{l}</Link>)}
      </nav>
      <ul className="mt-8 grid gap-4">
        {(data ?? []).length === 0 ? <li className="rounded-2xl bg-night p-6">Aucune demande.</li> : null}
        {(data ?? []).map((r) => (
          <li key={r.id} className="rounded-2xl bg-night p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p><span className="t-eyebrow text-lavender">{kinds[r.kind] ?? r.kind}</span> · <span className="font-semibold">{r.name}</span> · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ""}</p>
              <time className="text-xs text-mist/65" dateTime={r.created_at}>{new Date(r.created_at).toLocaleString("fr-FR")}</time>
            </div>
            {r.message ? <p className="mt-3 whitespace-pre-wrap">{r.message}</p> : null}
            {r.payload && Object.keys(r.payload).length ? (
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {Object.entries(r.payload as Record<string, string>).filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="inline font-semibold">{k} : </dt><dd className="inline">{String(v)}</dd></div>)}
              </dl>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <form action={setStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={r.id} />
                <label className="sr-only" htmlFor={`s${r.id}`}>Statut</label>
                <select id={`s${r.id}`} name="status" defaultValue={r.status} className="input !min-h-9 !w-auto !py-1">{Object.entries(statuses).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                <button className="btn btn-line !min-h-9 !px-4 !py-1">Mettre à jour</button>
              </form>
              <form action={deleteSubmission}><input type="hidden" name="id" value={r.id} /><button className="btn !min-h-9 !px-4 !py-1 text-[#ff9d8f] underline">Supprimer</button></form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
