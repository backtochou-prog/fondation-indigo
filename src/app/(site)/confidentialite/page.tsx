import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { Ph } from "@/components/ui";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Politique de confidentialité" };
export const revalidate = 300;

export default async function Confidentialite() {
  const s = await getSettings();
  return (
    <Legal title="Politique de confidentialité">
      <p>Nous collectons le strict nécessaire pour répondre à vos demandes. Nous ne vous demandons jamais d'informations de santé ou d'ordre psychologique.</p>
      <h2>Responsable du traitement</h2>
      <p><Ph value={s.legal_name} label="Entité à confirmer" /> — contact : <Ph value={s.contact_email} />.</p>
      <h2>Données collectées et finalités</h2>
      <ul>
        <li><strong>Formulaires</strong> (contact, Accueil Doux, ateliers, bénévolat, partenariat, mécénat) : nom ou prénom, e-mail, téléphone (facultatif), message et informations pratiques que vous choisissez de donner. Finalité : répondre à votre demande et organiser l'activité demandée.</li>
        <li><strong>Lettre d'information</strong> : adresse e-mail. Finalité : vous envoyer des nouvelles du projet.</li>
        <li><strong>Protection anti-abus</strong> : une empreinte irréversible (hachage salé) de l'adresse IP, utilisée uniquement pour limiter les envois répétés. L'adresse IP elle-même n'est pas conservée.</li>
      </ul>
      <h2>Base légale</h2>
      <p>Votre consentement (case à cocher), que vous pouvez retirer à tout moment.</p>
      <h2>Durée de conservation</h2>
      <p><span className="placeholder-tag">À confirmer</span> Proposition : demandes traitées conservées 12 mois maximum puis supprimées ; abonnés à la lettre conservés jusqu'à désinscription.</p>
      <h2>Destinataires et hébergement</h2>
      <p>Les données sont accessibles aux seules personnes habilitées de la fondation. Elles sont stockées chez notre sous-traitant Supabase (base de données) et le site est hébergé chez Vercel. <span className="placeholder-tag">À confirmer</span> région d'hébergement des données et clauses contractuelles applicables.</p>
      <h2>Vos droits</h2>
      <p>Accès, rectification, effacement, limitation, opposition, portabilité : écrivez à <Ph value={s.contact_email} />. Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).</p>
      <h2>Confidentialité des échanges d'écoute</h2>
      <p>Le cadre de confidentialité des rendez-vous et groupes d'écoute sera précisé avant leur ouverture. Il dépendra de l'organisation et du statut réels des personnes qui les animent.</p>
    </Legal>
  );
}
