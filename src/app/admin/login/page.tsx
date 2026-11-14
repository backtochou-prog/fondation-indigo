import { login } from "../actions";
import { Logo } from "@/components/Logo";

const msgs: Record<string, string> = {
  creds: "E-mail ou mot de passe incorrect.",
  denied: "Ce compte n'a pas les droits d'administration.",
  config: "Supabase n'est pas configuré (voir .env.example).",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <form action={login} className="w-full max-w-sm rounded-2xl bg-night p-8 shadow-sm">
        <Logo />
        <h1 className="mt-8 font-display text-3xl">Administration</h1>
        <div className="mt-6 grid gap-4">
          <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="username" className="input" /></div>
          <div className="field"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
          {e ? <p role="alert" className="err">{msgs[e] ?? "Connexion impossible."}</p> : null}
          <button className="btn btn-solid">Se connecter</button>
        </div>
      </form>
    </main>
  );
}
