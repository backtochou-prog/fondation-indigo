# Fondation Indigo — L'Âme a sa Place

Site Next.js 16 · TypeScript · Tailwind 4 · Supabase · prêt pour Vercel. Thème **interstellaire** (palette tirée du logo et de l'image principale fournis par la fondation).

## Démarrer
```bash
npm install
cp .env.example .env.local          # puis renseigner (voir plus bas)
npm run dev                         # http://localhost:3000
npm run build && npm start          # production
```
Sans Supabase, le site fonctionne en lecture (contenus par défaut). Pour tester les formulaires en local : `LOCAL_SUBMISSIONS_FALLBACK=true` (écrit dans `.data/submissions.jsonl`, ignoré par git — **jamais en production**).

## Configurer Supabase
1. Créer un projet sur supabase.com (région UE recommandée — à confirmer pour la politique de confidentialité).
2. SQL Editor → coller et exécuter `supabase/schema.sql` (tables + RLS + fonction `is_admin`).
3. Authentication → Users → *Add user* (e-mail + mot de passe fort). Copier son UUID.
4. SQL Editor : `insert into public.admin_users (user_id) values ('<UUID>');`
5. Project Settings → API : copier `URL`, `anon key`, `service_role key` dans `.env.local` (voir `.env.example`). La clé `service_role` reste **serveur uniquement**.
6. `IP_HASH_SALT` : `openssl rand -hex 32`.

## Déployer sur Vercel
1. Pousser le dossier sur un dépôt Git, l'importer dans Vercel (preset Next.js détecté).
2. Ajouter les variables d'environnement de `.env.example` (sauf `LOCAL_SUBMISSIONS_FALLBACK`). Ne jamais mettre la clé service en `NEXT_PUBLIC_`.
3. Définir `NEXT_PUBLIC_SITE_URL` sur le domaine final (sitemap, métadonnées).
4. Garder `NEXT_PUBLIC_DONATIONS_ENABLED=false` (voir « Dons »).

## Administration — `/admin`
Connexion e-mail/mot de passe. Un compte n'a accès que s'il figure dans `admin_users`.
- **Demandes reçues** : contact, Accueil Doux, ateliers/Cercle, bénévolat, partenariats, mécénat ; statut (nouvelle / en cours / traitée / archivée) ; suppression.
- **Contenus** (sans toucher au code) : statistiques, budget 6 mois, scénarios de contribution, objectifs/réalisé, rapports. Au premier usage d'une rubrique, cliquer « Initialiser avec le contenu par défaut », puis éditer ligne par ligne.
- **Informations légales & profils** : statut juridique, adresse, e-mail, hébergeur, profil de l'Ancre Psy, photo de la fondatrice, éligibilité fiscale, infos bancaires… Un champ vide s'affiche « À confirmer » sur le site.
- Règle d'or : ne remplir « Réalisé » et « Déjà financé » qu'avec des faits constatés.

## Dons (préparés, NON actifs)
`src/components/DonationPanel.tsx` est une interface désactivée. Pour activer, une fois statut juridique, compte bancaire et éligibilité fiscale vérifiés : créer une route serveur Stripe Checkout + webhook (`STRIPE_*`), brancher le panneau, publier la mention fiscale validée (réglage `tax_status`), puis `NEXT_PUBLIC_DONATIONS_ENABLED=true`. Rien de cela n'est implémenté aujourd'hui.

## Remplacer les visuels
- Image principale : `public/brand/hero-indigo.jpg` (recadrage 1536×660 de l'image fournie ; original dans `design-assets/`).
- Photos finales : déposer dans `public/photos/` et passer `src` à `<Photo />` (`src/components/Photo.tsx`). Les illustrations SVG (`scenes.tsx`) sont **temporaires**.
- Logo : `src/lib/logo-geometry.ts` → `node --experimental-strip-types scripts/export-logo.ts` régénère `public/brand/*.svg` et `src/app/icon.svg` (favicon). Pour le tirage papier/PNG, exporter les SVG.

## Design system
| Jeton | Hex | Usage |
|---|---|---|
| `night` | #0A0830 | fond de page |
| `night-2` | #100B42 | sections alternées |
| `indigo` | #17105C | panneaux, cartes |
| `indigo-deep` | #060420 | pied de page, final |
| `violet` | #5B32D6 | cœur, accents forts |
| `lavender` | #B9A4F2 | filets, eyebrows |
| `nebula` | #C45BE6 | lueurs uniquement |
| `gold` | #E8B26A | CTA, couronne, étoiles |
| `star` | #F4F0FD | titres, texte fort |
| `mist` | #CFC8EE | texte courant |

Typographie : Cormorant Garamond (titres, logotype en capitales espacées) + Manrope (texte), auto-hébergées via @fontsource. Tokens et composants (`.btn-*`, `.input`, `.t-*`, `.placeholder-tag`) dans `src/app/globals.css`.

## Structure
```
src/app/(site)/        pages publiques (accueil, notre-histoire, nos-actions[/accueil-doux], notre-impact, devenir-mecene, nous-rejoindre, légales)
src/app/admin/         login + panneau (demandes, contenu/[dataset], parametres) + actions serveur
src/app/api/submit/    réception unique des formulaires (validation, anti-abus, enregistrement)
src/components/        Nav, Footer, Form, Logo, scenes (SVG), blocks (stats/budget/objectifs), DonationPanel…
src/lib/               forms.ts (définition unique des formulaires), schemas.ts (Zod), content.ts (défauts), data.ts, supabase.ts, story.ts (textes d'origine)
src/proxy.ts           barrière /admin (307 sans session)
supabase/schema.sql    schéma + RLS
scripts/               export-logo, e2e, a11y, shots
```

## Sécurité & données
Validation Zod côté serveur (champs inconnus refusés) · RLS sur toutes les tables, aucune lecture publique des données personnelles · insertion via le serveur uniquement · limitation 5 envois/10 min/IP (IP hachée salée, jamais stockée) · pot de miel · refus des origines étrangères · en-têtes de sécurité · contrôle d'accès revérifié dans chaque page et action admin · aucune donnée de santé demandée.

## Tests
`npm run build` · `node scripts/e2e.cjs` (liens, formulaires, validation serveur, limitation, admin, menu mobile) · `node scripts/a11y.cjs` (axe WCAG 2.1 AA). Lancer avec `NODE_PATH` pointant vers un dossier contenant `playwright` et `@axe-core/playwright`.
