import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Administration", template: "%s · Admin Indigo" }, robots: { index: false, follow: false } };
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-night-2 text-[0.95rem]">{children}</div>;
}
