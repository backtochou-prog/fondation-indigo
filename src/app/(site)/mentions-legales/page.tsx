import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { Ph } from "@/components/ui";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Mentions légales" };
export const revalidate = 300;

export default async function Mentions() {
  const s = await getSettings();
  return (
    <Legal title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>Fondation Indigo — « L'Âme a sa Place ». Projet en cours de création à Strasbourg.</p>
      <ul>
        <li>Statut juridique : <Ph value={s.legal_status} /></li>
        <li>Dénomination officielle : <Ph value={s.legal_name} /></li>
        <li>Numéro d'enregistrement : <Ph value={s.registration_id} /></li>
        <li>Adresse : <Ph value={s.address} /></li>
        <li>Contact : <Ph value={s.contact_email} /></li>
        <li>Directeur·rice de la publication : <Ph value={s.publication_director} /></li>
      </ul>
      <h2>Hébergement</h2>
      <p><Ph value={s.host} /></p>
      <h2>Nature des activités</h2>
      <p>Fondation Indigo propose des espaces d'écoute, de rencontre et de bien-être. Elle n'exerce pas d'activité médicale ou de psychothérapie, ne pose aucun diagnostic et ne remplace aucun suivi professionnel de santé.</p>
      <h2>Dons et fiscalité</h2>
      <p>{s.tax_status ? s.tax_status : "Aucun don n'est collecté à ce jour. Aucune éligibilité à un avantage fiscal n'est affirmée tant que le statut juridique et l'éligibilité n'ont pas été confirmés."}</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les textes, le logo et les visuels de ce site sont la propriété de Fondation Indigo, sauf mention contraire. Les illustrations actuelles sont temporaires.</p>
    </Legal>
  );
}
