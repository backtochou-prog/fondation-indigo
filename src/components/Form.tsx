"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { forms, type FormKind } from "@/lib/forms";

type Status = "idle" | "sending" | "done" | "error";

export function Form({ kind, tone = "light", compact = false }: { kind: FormKind; tone?: "light" | "dark"; compact?: boolean }) {
  const def = forms[kind];
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = { kind, website: fd.get("website") ?? "" };
    for (const f of def.fields) payload[f.name] = String(fd.get(f.name) ?? "").trim();
    payload.consent = fd.get("consent") === "on";

    // validation immédiate côté navigateur (la vraie validation reste côté serveur)
    const local: Record<string, string> = {};
    for (const f of def.fields) {
      const v = payload[f.name] as string;
      if (f.required && !v) local[f.name] = "Ce champ est requis";
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) local[f.name] = "Adresse e-mail invalide";
    }
    if (!payload.consent) local.consent = "Votre accord est nécessaire pour envoyer ce formulaire";
    setErrors(local);
    setGlobalError("");
    if (Object.keys(local).length) {
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      requestAnimationFrame(() => (formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`) ?? first)?.focus());
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("done");
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      if (json.errors) setErrors(json.errors);
      setGlobalError(json.error ?? "Quelque chose n'a pas fonctionné. Vérifiez les champs ou réessayez dans un instant.");
      setStatus("error");
    } catch {
      setGlobalError("Connexion impossible. Vérifiez votre réseau puis réessayez.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className={`rounded-2xl p-8 outline-none ${tone === "dark" ? "bg-night/10 text-star" : "bg-violet/25 text-star"}`}>
        <p className="font-display text-2xl">{def.success}</p>
      </div>
    );
  }

  const dark = tone === "dark";
  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={`grid gap-5 ${dark ? "on-dark" : ""}`} aria-busy={status === "sending"}>
      {def.fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id, name: f.name, required: f.required, maxLength: f.max, autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": [f.hint ? `${id}-h` : "", err ? `${id}-e` : ""].filter(Boolean).join(" ") || undefined,
          className: "input",
        } as const;
        return (
          <div className="field" key={f.name}>
            <label htmlFor={id} className={dark ? "!text-star" : ""}>{f.label}{f.required ? <span aria-hidden="true"> *</span> : null}</label>
            {f.type === "textarea" ? <textarea {...common} rows={compact ? 3 : 5} />
              : f.type === "select" ? (
                <select {...common} defaultValue="">
                  <option value="" disabled>Choisir…</option>
                  {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : <input {...common} type={f.type} inputMode={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined} />}
            {f.hint ? <p id={`${id}-h`} className={`hint ${dark ? "!text-star/75" : ""}`}>{f.hint}</p> : null}
            {err ? <p id={`${id}-e`} className={`err ${dark ? "!text-[#f3b9ad]" : ""}`}>{err}</p> : null}
          </div>
        );
      })}

      {/* pot de miel anti-robots : invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="field">
        <label className={`flex cursor-pointer items-start gap-3 !font-normal ${dark ? "!text-star" : ""}`}>
          <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-gold" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${uid}-c` : undefined} />
          <span className="text-sm leading-relaxed">
            J'accepte que mes informations soient utilisées pour répondre à ma demande, comme expliqué dans la{" "}
            <Link href="/confidentialite" className="link-u" target="_blank">politique de confidentialité</Link>.
          </span>
        </label>
        {errors.consent ? <p id={`${uid}-c`} className={`err ${dark ? "!text-[#f3b9ad]" : ""}`}>{errors.consent}</p> : null}
      </div>

      <div aria-live="polite" className="min-h-0">
        {globalError ? <p className={`err ${dark ? "!text-[#f3b9ad]" : ""}`} role="alert">{globalError}</p> : null}
      </div>

      <div>
        <button type="submit" disabled={status === "sending"} className={`btn ${dark ? "btn-light" : "btn-solid"}`}>
          {status === "sending" ? "Envoi en cours…" : def.submit}
        </button>
      </div>
    </form>
  );
}
