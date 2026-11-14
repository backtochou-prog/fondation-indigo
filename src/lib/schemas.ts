import { z } from "zod";
import { forms, type FormKind } from "./forms";

/** Construit le schéma Zod serveur à partir de la définition partagée des formulaires. */
export function schemaFor(kind: FormKind) {
  const def = forms[kind];
  const shape: Record<string, z.ZodType> = {};
  for (const f of def.fields) {
    let s: z.ZodType;
    if (f.type === "email") s = z.string().trim().toLowerCase().email("Adresse e-mail invalide").max(f.max ?? 160);
    else if (f.type === "select") s = z.enum(f.options!.map((o) => o.value) as [string, ...string[]], { message: "Choix invalide" });
    else {
      let t = z.string().trim().max(f.max ?? 500, "Texte trop long");
      if (f.type === "tel") t = t.regex(/^[+\d\s().-]{0,30}$/, "Numéro invalide");
      if (f.required) t = t.min(1, "Ce champ est requis");
      s = t;
    }
    shape[f.name] = f.required ? s : z.union([s, z.literal("")]).optional();
  }
  shape.consent = z.literal(true, { message: "Votre accord est nécessaire pour envoyer ce formulaire" });
  return z.object(shape).strict();
}
