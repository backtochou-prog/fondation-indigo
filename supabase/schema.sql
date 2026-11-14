-- ═══════════════════════════════════════════════════════════════
-- FONDATION INDIGO — schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Principe : RLS activée PARTOUT. Les formulaires publics écrivent via le serveur Next.js
-- (clé service), jamais directement depuis le navigateur. Aucune donnée personnelle n'est lisible
-- avec la clé publique (anon).
-- ═══════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- Administrateurs autorisés (ajoutez l'UUID d'un utilisateur créé dans Authentication > Users)
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Demandes reçues (contact, Accueil Doux, ateliers, bénévolat, partenariats, mécénat)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact','accueil_doux','atelier','benevole','partenariat','mecenat')),
  name text,
  email text,
  phone text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','in_progress','done','archived')),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists submissions_kind_idx on public.submissions(kind, created_at desc);
create index if not exists submissions_ip_idx on public.submissions(ip_hash, created_at desc);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  consent_at timestamptz not null default now(),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists newsletter_ip_idx on public.newsletter_subscribers(ip_hash, created_at desc);

-- Contenus éditables (lus par le site, modifiés depuis /admin)
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(), sort int not null default 0, published boolean not null default true,
  figure text not null, label text not null,
  status text not null default 'to_verify' check (status in ('verified','partial','to_verify','positioning')),
  source_name text not null default '', source_url text not null default '', note text not null default ''
);
create table if not exists public.budget_lines (
  id uuid primary key default gen_random_uuid(), sort int not null default 0, published boolean not null default true,
  category text not null, description text not null default '',
  estimated_eur numeric(12,2) check (estimated_eur is null or estimated_eur >= 0),
  funded_eur numeric(12,2) check (funded_eur is null or funded_eur >= 0)
);
create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(), sort int not null default 0, published boolean not null default true,
  title text not null, description text not null default '', amount_eur numeric(12,2) check (amount_eur is null or amount_eur >= 0)
);
create table if not exists public.objectives (
  id uuid primary key default gen_random_uuid(), sort int not null default 0, published boolean not null default true,
  label text not null, unit text not null default '', target text, achieved text
);
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(), sort int not null default 0, published boolean not null default true,
  title text not null, period text not null default '', url text not null default ''
);
create table if not exists public.settings (key text primary key, value text not null default '');

-- ───────── Row Level Security ─────────
alter table public.admin_users enable row level security;
alter table public.submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.stats enable row level security;
alter table public.budget_lines enable row level security;
alter table public.scenarios enable row level security;
alter table public.objectives enable row level security;
alter table public.reports enable row level security;
alter table public.settings enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Un administrateur peut vérifier sa propre appartenance
create policy "admin sees self" on public.admin_users for select to authenticated using (user_id = auth.uid());

-- Données personnelles : administrateurs uniquement (aucune politique pour anon => aucun accès)
create policy "admins read submissions" on public.submissions for select to authenticated using (public.is_admin());
create policy "admins update submissions" on public.submissions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete submissions" on public.submissions for delete to authenticated using (public.is_admin());
create policy "admins read newsletter" on public.newsletter_subscribers for select to authenticated using (public.is_admin());
create policy "admins delete newsletter" on public.newsletter_subscribers for delete to authenticated using (public.is_admin());

-- Contenus : lecture publique des lignes publiées, écriture administrateurs
do $$
declare t text;
begin
  foreach t in array array['stats','budget_lines','scenarios','objectives','reports'] loop
    execute format('create policy "public reads published" on public.%I for select to anon, authenticated using (published = true)', t);
    execute format('create policy "admins write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;
create policy "admins manage settings" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- (settings n'est pas lisible publiquement : le serveur Next.js la lit avec la clé service)

-- ───────── Après avoir créé votre utilisateur (Authentication > Users) ─────────
-- insert into public.admin_users (user_id) values ('<UUID-de-l-utilisateur>');
