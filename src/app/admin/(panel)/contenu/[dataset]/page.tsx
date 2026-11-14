import { notFound } from "next/navigation";
import { requireAdminClient } from "@/lib/supabase";
import { datasets, isDataset, type Col } from "@/lib/datasets";
import { deleteRow, saveRow, seedDataset } from "../../../actions";

function Cell({ c, v, id }: { c: Col; v: unknown; id: string }) {
  const common = { id, name: c.key, defaultValue: v == null ? "" : String(v), className: "input" };
  if (c.type === "textarea") return <textarea {...common} rows={3} />;
  if (c.type === "select") return <select {...common}>{c.options!.map((o) => <option key={o}>{o}</option>)}</select>;
  return <input {...common} type={c.type === "number" ? "number" : "text"} step={c.type === "number" ? "0.01" : undefined} min={c.type === "number" ? 0 : undefined} />;
}

export default async function Dataset({ params }: { params: Promise<{ dataset: string }> }) {
  const { dataset } = await params;
  if (!isDataset(dataset)) notFound();
  const cfg = datasets[dataset];
  const svc = await requireAdminClient();
  const { data } = await svc.from(dataset).select("*").order("sort", { ascending: true });
  const rows = (data ?? []) as Record<string, unknown>[];

  const Row = ({ r }: { r: Record<string, unknown> | null }) => {
    const rid = String(r?.id ?? "new");
    return (
      <form action={saveRow} className="rounded-2xl bg-night p-5">
        <input type="hidden" name="dataset" value={dataset} />
        {r ? <input type="hidden" name="id" value={rid} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {cfg.cols.map((c) => (
            <div key={c.key} className={`field ${c.wide ? "md:col-span-2" : ""}`}>
              <label htmlFor={`${c.key}-${rid}`}>{c.label}</label>
              <Cell c={c} v={r?.[c.key]} id={`${c.key}-${rid}`} />
            </div>
          ))}
          <div className="field"><label htmlFor={`sort-${rid}`}>Ordre</label><input id={`sort-${rid}`} name="sort" type="number" defaultValue={Number(r?.sort ?? rows.length)} className="input" /></div>
          <label className="flex items-center gap-2 self-end pb-3"><input type="checkbox" name="published" defaultChecked={r ? Boolean(r.published) : true} className="h-5 w-5 accent-gold" /> Publié sur le site</label>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn btn-solid !min-h-10">{r ? "Enregistrer" : "Ajouter"}</button>
          {r ? <button formAction={deleteRow} className="btn !min-h-10 text-[#ff9d8f] underline">Supprimer</button> : null}
        </div>
      </form>
    );
  };

  return (
    <>
      <h1 className="font-display text-4xl">{cfg.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist/80">{cfg.help}</p>
      {rows.length === 0 && cfg.defaults.length > 0 ? (
        <form action={seedDataset} className="mt-6 rounded-2xl border border-dashed border-lavender/40 p-5">
          <input type="hidden" name="dataset" value={dataset} />
          <p className="mb-3">Cette rubrique est vide : le site affiche actuellement le contenu par défaut du code.</p>
          <button className="btn btn-solid !min-h-10">Initialiser avec le contenu par défaut</button>
        </form>
      ) : null}
      <div className="mt-8 grid gap-5">
        {rows.map((r) => <Row key={String(r.id)} r={r} />)}
        <h2 className="mt-6 font-display text-2xl">Ajouter une ligne</h2>
        <Row r={null} />
      </div>
    </>
  );
}
