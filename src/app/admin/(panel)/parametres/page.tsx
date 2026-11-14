import { requireAdminClient } from "@/lib/supabase";
import { settingFields } from "@/lib/content";
import { saveSettings } from "../../actions";

export default async function Parametres() {
  const svc = await requireAdminClient();
  const { data } = await svc.from("settings").select("key,value");
  const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value as string]));
  return (
    <>
      <h1 className="font-display text-4xl">Informations légales & profils</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist/80">Un champ vide s'affiche « À confirmer » sur le site. Ne renseignez que des informations vérifiées (statut, qualifications, éligibilité fiscale).</p>
      <form action={saveSettings} className="mt-8 grid max-w-2xl gap-5 rounded-2xl bg-night p-6">
        {settingFields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={f.key}>{f.label}</label>
            <textarea id={f.key} name={f.key} rows={2} defaultValue={v[f.key] ?? ""} className="input !min-h-[3rem]" />
            {f.hint ? <p className="hint">{f.hint}</p> : null}
          </div>
        ))}
        <div><button className="btn btn-solid">Enregistrer</button></div>
      </form>
    </>
  );
}
