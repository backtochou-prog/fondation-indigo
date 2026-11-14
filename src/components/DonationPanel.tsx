/**
 * Interface de don PRÉPARÉE, volontairement NON ACTIVE.
 * Elle ne branche aucun paiement tant que : statut juridique, compte bancaire et éligibilité fiscale ne sont pas vérifiés.
 * Pour activer : voir README > « Activer les dons » (Stripe Checkout côté serveur + webhook), puis NEXT_PUBLIC_DONATIONS_ENABLED=true.
 */
export function DonationPanel() {
  const enabled = process.env.NEXT_PUBLIC_DONATIONS_ENABLED === "true";
  return (
    <div className="rounded-2xl border border-dashed border-lavender/40 p-7">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="t-h3">Faire un don</h3>
        <span className="placeholder-tag">Pas encore ouvert</span>
      </div>
      <p className="mt-3 text-[0.95rem]">Les dons en ligne seront ouverts une fois le cadre juridique et bancaire de la fondation vérifié. Nous ne collectons aucun paiement pour l'instant.</p>
      <fieldset disabled className="mt-6 grid gap-4 opacity-60">
        <legend className="sr-only">Type de don (indisponible)</legend>
        <div className="flex gap-2">
          <span className="btn btn-line !min-h-10" aria-hidden="true">Ponctuel</span>
          <span className="btn btn-line !min-h-10" aria-hidden="true">Mensuel</span>
        </div>
        <div className="flex flex-wrap gap-2" aria-hidden="true">
          {["—", "—", "—"].map((a, i) => <span key={i} className="btn btn-line !min-h-10 !px-6">{a} €</span>)}
        </div>
        <button type="button" className="btn btn-solid w-fit" aria-disabled="true" tabIndex={-1}>Donner</button>
      </fieldset>
      {enabled ? <p className="err mt-4" role="alert">NEXT_PUBLIC_DONATIONS_ENABLED est « true » mais aucun paiement n'est branché : ne pas activer en production.</p> : null}
    </div>
  );
}
