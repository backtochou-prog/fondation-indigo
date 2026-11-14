import { PageHero } from "./ui";

export function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Informations légales" title={title} />
      <div className="wrap-narrow pb-24">
        <p className="mb-10 rounded-xl border border-dashed border-gold/60 p-4 text-sm text-gold">
          <strong>Document de travail à faire valider juridiquement</strong> avant publication officielle. Les éléments marqués « À confirmer » doivent être renseignés dans l'espace d'administration (Paramètres).
        </p>
        <div className="space-y-5 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_li]:ml-5 [&_li]:list-disc [&_a]:underline">{children}</div>
      </div>
    </>
  );
}
