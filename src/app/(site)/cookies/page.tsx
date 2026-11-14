import type { Metadata } from "next";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Cookies" };

export default function Cookies() {
  return (
    <Legal title="Cookies et traceurs">
      <p>Ce site n'utilise actuellement <strong>aucun cookie publicitaire, aucun outil de mesure d'audience et aucun traceur tiers</strong>. Les polices sont hébergées par le site lui-même.</p>
      <h2>Cookies strictement nécessaires</h2>
      <p>Seul l'espace d'administration (réservé à l'équipe) dépose un cookie de session d'authentification. Il ne nécessite pas de consentement.</p>
      <h2>Si cela change</h2>
      <p>Si un outil de mesure d'audience, de vidéo ou de paiement était ajouté, un bandeau de consentement conforme aux recommandations de la CNIL (refuser aussi simple qu'accepter) serait mis en place avant tout dépôt de traceur.</p>
    </Legal>
  );
}
