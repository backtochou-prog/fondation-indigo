/** Définition unique des formulaires : utilisée par l'interface ET par la validation serveur. */
export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  max?: number;
  hint?: string;
  options?: { value: string; label: string }[];
  autoComplete?: string;
};

export type FormKind = "contact" | "accueil_doux" | "atelier" | "benevole" | "partenariat" | "mecenat" | "newsletter";

export type FormDef = { kind: FormKind; submit: string; success: string; fields: FieldDef[]; notice?: string };

const MEDICAL = "Inutile de détailler votre situation personnelle ou de santé : nous en parlerons ensemble si vous le souhaitez.";

export const forms: Record<FormKind, FormDef> = {
  contact: {
    kind: "contact",
    submit: "Envoyer mon message",
    success: "Merci, votre message nous est bien parvenu. Nous vous répondrons dès que possible.",
    fields: [
      { name: "name", label: "Votre prénom", type: "text", required: true, max: 80, autoComplete: "given-name" },
      { name: "email", label: "Votre e-mail", type: "email", required: true, max: 160, autoComplete: "email" },
      { name: "message", label: "Votre message", type: "textarea", required: true, max: 1500, hint: MEDICAL },
    ],
  },
  accueil_doux: {
    kind: "accueil_doux",
    submit: "Demander mon Accueil Doux",
    success: "Merci. Votre demande est bien reçue. Nous vous écrirons pour proposer un moment, à votre rythme.",
    fields: [
      { name: "name", label: "Votre prénom", type: "text", required: true, max: 80, autoComplete: "given-name" },
      { name: "email", label: "Votre e-mail", type: "email", required: true, max: 160, autoComplete: "email" },
      { name: "phone", label: "Téléphone (facultatif)", type: "tel", max: 30, autoComplete: "tel" },
      {
        name: "contact_pref", label: "Comment préférez-vous être recontacté·e ?", type: "select", required: true,
        options: [{ value: "email", label: "Par e-mail" }, { value: "phone", label: "Par téléphone" }],
      },
      { name: "availability", label: "Vos disponibilités (jours, créneaux)", type: "text", max: 200, hint: "Ex. : en soirée, le mercredi, le week-end…" },
      { name: "message", label: "Un mot si vous le souhaitez (facultatif)", type: "textarea", max: 600, hint: MEDICAL },
    ],
  },
  atelier: {
    kind: "atelier",
    submit: "M'inscrire à la liste",
    success: "Merci. Nous vous recontacterons dès que les prochaines dates seront fixées.",
    fields: [
      { name: "name", label: "Votre prénom", type: "text", required: true, max: 80, autoComplete: "given-name" },
      { name: "email", label: "Votre e-mail", type: "email", required: true, max: 160, autoComplete: "email" },
      { name: "phone", label: "Téléphone (facultatif)", type: "tel", max: 30, autoComplete: "tel" },
      {
        name: "program", label: "Ce qui vous attire", type: "select", required: true,
        options: [
          { value: "cercle", label: "Le Cercle d'Âmes" },
          { value: "ecriture", label: "Atelier — Écriture" },
          { value: "respiration", label: "Atelier — Respiration" },
          { value: "meditation", label: "Atelier — Méditation" },
          { value: "art", label: "Atelier — Art" },
          { value: "nature", label: "Atelier — Nature" },
          { value: "indecis", label: "Je ne sais pas encore" },
        ],
      },
      { name: "message", label: "Une question, une envie ? (facultatif)", type: "textarea", max: 600 },
    ],
  },
  benevole: {
    kind: "benevole",
    submit: "Proposer mon aide",
    success: "Merci pour votre élan. Nous reviendrons vers vous pour en parler.",
    fields: [
      { name: "name", label: "Votre prénom et nom", type: "text", required: true, max: 120, autoComplete: "name" },
      { name: "email", label: "Votre e-mail", type: "email", required: true, max: 160, autoComplete: "email" },
      { name: "phone", label: "Téléphone (facultatif)", type: "tel", max: 30, autoComplete: "tel" },
      {
        name: "profile", label: "Vous êtes…", type: "select", required: true,
        options: [
          { value: "benevole", label: "Bénévole" },
          { value: "professionnel", label: "Professionnel·le (accompagnement, bien-être, art…)" },
          { value: "autre", label: "Autre" },
        ],
      },
      { name: "skills", label: "Ce que vous pouvez apporter", type: "textarea", required: true, max: 800, hint: "Compétences, métier, matériel, temps disponible." },
      { name: "availability", label: "Vos disponibilités", type: "text", max: 200 },
    ],
  },
  partenariat: {
    kind: "partenariat",
    submit: "Envoyer la demande",
    success: "Merci. Votre demande de partenariat est bien reçue ; nous vous répondrons personnellement.",
    fields: [
      { name: "organisation", label: "Organisation", type: "text", required: true, max: 160, autoComplete: "organization" },
      { name: "name", label: "Votre nom", type: "text", required: true, max: 120, autoComplete: "name" },
      { name: "role", label: "Votre fonction (facultatif)", type: "text", max: 120, autoComplete: "organization-title" },
      { name: "email", label: "E-mail professionnel", type: "email", required: true, max: 160, autoComplete: "email" },
      {
        name: "type", label: "Type de structure", type: "select", required: true,
        options: [
          { value: "entreprise", label: "Entreprise" },
          { value: "fondation", label: "Fondation / fonds de dotation" },
          { value: "institution", label: "Institution / collectivité" },
          { value: "association", label: "Association" },
          { value: "autre", label: "Autre" },
        ],
      },
      { name: "message", label: "Votre intention de partenariat", type: "textarea", required: true, max: 1500 },
    ],
  },
  mecenat: {
    kind: "mecenat",
    submit: "Faire part de mon intention",
    success: "Merci. Nous vous contacterons pour échanger, sans engagement.",
    fields: [
      { name: "name", label: "Votre prénom et nom", type: "text", required: true, max: 120, autoComplete: "name" },
      { name: "email", label: "Votre e-mail", type: "email", required: true, max: 160, autoComplete: "email" },
      {
        name: "type", label: "Votre manière de soutenir", type: "select", required: true,
        options: [
          { value: "individuel", label: "Mécénat individuel" },
          { value: "entreprise", label: "Mécénat d'entreprise" },
          { value: "competences", label: "Compétences, matériel ou lieu" },
          { value: "autre", label: "Je ne sais pas encore" },
        ],
      },
      { name: "message", label: "Un mot (facultatif)", type: "textarea", max: 1200 },
    ],
  },
  newsletter: {
    kind: "newsletter",
    submit: "Recevoir des nouvelles",
    success: "Merci, votre adresse est enregistrée. Vous pouvez vous désinscrire à tout moment.",
    fields: [{ name: "email", label: "Votre e-mail", type: "email", required: true, max: 160, autoComplete: "email" }],
  },
};
