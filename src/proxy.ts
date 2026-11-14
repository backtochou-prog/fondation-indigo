import { NextResponse, type NextRequest } from "next/server";

/**
 * Première barrière pour /admin : sans cookie de session Supabase, redirection immédiate (307).
 * Ce n'est PAS la sécurité principale : chaque page et chaque action serveur revérifie la session
 * ET l'appartenance à la table admin_users (voir lib/supabase.ts > getAdmin / requireAdminClient).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const hasSession = req.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (!hasSession) return NextResponse.redirect(new URL("/admin/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
