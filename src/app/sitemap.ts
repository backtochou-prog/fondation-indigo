import type { MetadataRoute } from "next";
const paths = ["", "/notre-histoire", "/nos-actions", "/nos-actions/accueil-doux", "/notre-impact", "/devenir-mecene", "/nous-rejoindre", "/mentions-legales", "/confidentialite", "/cookies"];
export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return paths.map((p) => ({ url: `${site}${p}`, lastModified: new Date() }));
}
