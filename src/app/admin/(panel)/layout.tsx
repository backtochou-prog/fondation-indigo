export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase";
import { logout } from "../actions";
import { Logo } from "@/components/Logo";
import { datasets } from "@/lib/datasets";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const links = [
    ["/admin", "Vue d'ensemble"],
    ["/admin/demandes", "Demandes reçues"],
    ...Object.entries(datasets).map(([k, v]) => [`/admin/contenu/${k}`, v.title]),
    ["/admin/parametres", "Informations légales & profils"],
  ];
  return (
    <div className="grid min-h-dvh lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-lavender/15 bg-night p-5 lg:border-b-0 lg:border-r">
        <Logo />
        <nav aria-label="Administration" className="mt-6">
          <ul className="grid gap-1">{links.map(([h, l]) => <li key={h}><Link href={h} className="block rounded-lg px-3 py-2 hover:bg-night-2">{l}</Link></li>)}</ul>
        </nav>
        <form action={logout} className="mt-6"><button className="btn btn-line !min-h-10 !px-4 !py-1.5 text-sm">Se déconnecter</button></form>
        <p className="mt-4 break-all text-xs text-mist/65">{admin.email}</p>
      </aside>
      <div className="min-w-0 p-5 md:p-10">{children}</div>
    </div>
  );
}
